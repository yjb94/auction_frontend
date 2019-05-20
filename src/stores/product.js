import { observable, action } from 'mobx';
import { getEndpoint, getConfig } from "../constants/general";
import axios from 'axios';
import { mapArrayWithKey } from '../utils/utils';

class ProductStore {
    @observable products = {};
    @observable isFetching = false;
    last = undefined;
    needMore = true;

    handleError = (err) => {
        this.isFetching = false;
        console.error(err);
    }

    tuneProductData = (product) => {
        const tuned = {};
        tuned[product.id] = product;
        this.products = { ...tuned, ...this.products, };
        return tuned;
    }

    @action load = (limit = 5) => {
        if(!this.needMore || this.isFetching) return;
        // this.isFetching = true;

        const params = { 
            limit:limit,
            last:this.last
        };

        this.products = {
            "-LRpAsw7OhoyPcDBhiOB" : {
                description: "레오나르도 다 빈치가 피렌체의 부호(富豪) 프란체스코 델 조콘다를 위하여 그 부인을 그린 초상화.",
                id: "-LRpAsw7OhoyPcDBhiOB",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
                price: "100000",
                title: "모나리자"
            },
            "-LRpBBMEA4YB1O6i-X3Z": {
                description: "생레미 정신병원에 입원하여 그린 작품으로 자신이 보았던 아름다운 밤하늘을 자신의 마음을 담아 신비롭게 그린 풍경화.",
                id: "-LRpBBMEA4YB1O6i-X3Z",
                image: "http://www.ofmkorea.org/files/attach/images/246/203/047/fbc0329fc0128a502b0241d657aca8bd.gif",
                price: "150000",
                title: "별이 빛나는 밤(Starry night)"
            },
            "-LRpBBMEA4YB1O6i-X3Y": {
                description: "프랑스의 화가 밀레가 그린 '이삭 줍는 여인들'",
                id: "-LRpBBMEA4YB1O6i-X3Y",
                image: "https://t1.daumcdn.net/cfile/tistory/2238DC33573575041F",
                price: "120000",
                title: "이삭 줍는 여인들"
            },
            "-LRpBBMEA4YB1O6i-X31": {
                description: "조르주 피에르 쇠라가 그린 점묘화. 점묘주의의 시작을 알린 작품이다.",
                id: "-LRpBBMEA4YB1O6i-X31",
                image: "https://t1.daumcdn.net/cfile/tistory/147B4638500EBF1723",
                price: "150000",
                title: "그랑드 자트 섬의 일요일 오후"
            }
        }
        // return axios.get(getEndpoint(`products`), { params:params }).then((res) => {
        //     this.isFetching = false;

        //     const { data } = res;
        //     const tuned = mapArrayWithKey(data.products, 'id');
        //     this.products = { ...this.products, ...tuned };
        //     this.last = data.last;
        //     this.needMore = data.total > Object.keys(this.products).length;
        //     return data.product;
        // }).catch(this.handleError);
    }
    
    @action create = (attr) => {
        axios.post(getEndpoint(`product`), JSON.stringify({ attr:attr }), getConfig()).then((res) => {
            this.isFetching = false;

            const { data } = res;
            return this.tuneProductData(data);
        }).catch(this.handleError);
    }


    @action get = (pid) => {
        if(!pid) {
            this.handleError('no pid');
            return;
        }
        this.products['-LRpAsw7OhoyPcDBhiOB'] = {
            description: "결혼식이 산으로 갑니다.",
            id: "-LRpAsw7OhoyPcDBhiOB",
            image: "https://firebasestorage.googleapis.com/v0/b/onthe-house.appspot.com/o/images%2Fimage-le638vwhae.jpg?alt=media&token=fe132d04-df97-483a-bbca-861799166b23",
            price: "99",
            title: "청첩장 문구"
        }

        // this.isFetching = true;

        // axios.get(getEndpoint(`product/${pid}`)).then((res) => {
        //     this.isFetching = false;

        //     const { data } = res;
        //     return this.tuneProductData(data);
        // }).catch(this.handleError);
    }
}
export default new ProductStore();