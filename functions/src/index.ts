import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as utils from './utils';

import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
const cors = require('cors');

const db = admin.database();

const app = express();
const main = express();

app.use(cors({ origin: true }));
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
export const webApi = functions.https.onRequest(main);


// general

const sendError = (res, error:String): void => {
    console.error(error);
    res.sendStatus(404);
}
const verify = (req, res) => {
    const idToken = req.get('Authorization');
    return admin.auth().verifyIdToken(idToken).catch((error) => sendError(res, error));
}

//user

// creates default element for initial user
exports.onCreateUser = functions.auth.user().onCreate((user) => {
    const { uid, email, emailVerified } = user;
    const dbRef = db.ref(`/users/${uid}`);
    const updates = {
        email:email,
        emailVerified:emailVerified,
        created_at: utils.getTime()
    }
    dbRef.update(updates)
        .then()
        .catch(error => console.error(error));
});


app.get('/user/:uid', (req, res) => {
    const uid = req.params.uid.toString();
    console.info(`GET /user/${uid}`);
    if(!uid) {
        sendError(res, 'No Uid found');
    }
    
    return db.ref(`users/${uid}`).once('value').then(snap => {
        const user = snap.val();
        if (user) {
            delete user['created_at'];
            res.send(user);
        } else {
            sendError(res, 'User not found');
        }
    }).catch((error) => {
        sendError(res, error.toString());
    });
})

app.post('/user/:uid', (req, res) => {
    verify(req, res).then(() => {
        const uid = req.params.uid.toString();
        const attr = req.body.attr;
        console.info(`POST /user/${uid}`);
        if(!uid) {
            sendError(res, 'No Uid found');
        }
        if(!attr || Object.keys(attr).length === 0) {
            sendError(res, 'No attributes to update');
        }
    
        const dbRef = db.ref(`/users/${uid}`);
        console.info(`/users/${uid} update - ${JSON.stringify(attr)}`);
        dbRef.update(attr)
            .then(result => res.send(result))
            .catch(error => sendError(res, error));
    });
})


//product

app.post('/product', (req, res) => {
    verify(req, res).then(() => {
        console.info(`POST /product/`);

        const pid = admin.database().ref('/products/').push().key;
        const dbRef = db.ref(`/products/${pid}`);
        const attr = { ...req.body.attr, id:pid };

        console.info(`/product/ create - ${JSON.stringify(attr)}`);

        dbRef.update(attr)
            .then(_ => res.send(attr))
            .catch(error => sendError(res, error));
    });
})

app.get('/product/:pid', (req, res) => {
    const pid = req.params.pid.toString();
    console.info(`GET /product/${pid}`);
    if(!pid) {
        sendError(res, 'No product id given');
    }
    
    return db.ref(`products/${pid}`).once('value').then(snap => {
        const product = snap.val();
        if (product) {
            product.id = pid;
            res.send(product);
        } else {
            sendError(res, 'Product not found');
        }
    }).catch((error) => {
        sendError(res, error.toString());
    });
});

app.get('/products', (req, res) => {
    console.info(`GET /products`);

    const retrieve = (limit, last) => {
        const ref = db.ref(`products/`);

        return ref.once('value').then(snapshot => {
            const objectData = snapshot.val() || {};
            let indexOfLast = -1;
            const products = Object.keys(objectData).map((key, idx) => {
                objectData[key].id = key;
                if(key === last) indexOfLast = idx;
                return objectData[key];
            })

            const firstIdx = last ? indexOfLast : 0;
            const lastIdx = firstIdx + limit + 1;
            const sliced = products.slice(Math.max(firstIdx, 0), Math.min(lastIdx, products.length));

            let cursor = undefined;
            if (sliced.length > limit) 
                cursor = sliced.pop().id;
            
            return { products: sliced, total: Object.keys(objectData).length, last: cursor };
        });
    };

    retrieve(req.query.limit * 1 || 3, req.query.last)
    .then(result => res.send(result))
    .catch(error => sendError(res, error));
});