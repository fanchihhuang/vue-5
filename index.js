const {createApp}=Vue;

const app=createApp({
    data() {
        return {
           cart:{},
           user:{},
           products:[],
           temp:{
            imagesUrl:[]
           },
           
        }
    },
    methods:{
       getData(){
        const url="https://vue3-course-api.hexschool.io/v2/api/likefanzi/products/all";
        axios.get(url)
        .then((res)=>{
            this.products=res.data.products;
        })
        .catch((err)=>{
            alert(err.data.message);
        })
       },
       openProductModal(id){
        const url=`https://vue3-course-api.hexschool.io/v2/api/likefanzi/product/${id}`;
        axios.get(url)
        .then((res)=>{
            this.temp={...res.data.product};
            this.$refs.modalRef.openModal();    
        })
        .catch((err)=>{
            alert(err.data.message);
        })
       },
       addToCart(product_id,qty=1){
        const url="https://vue3-course-api.hexschool.io/v2/api/likefanzi/cart";
        axios.post(url,{
            "data": {
              product_id,qty
            }
          })
        .then((res)=>{
            alert(res.data.message);
            this.$refs.modalRef.qty=1;
            this.$refs.modalRef.closeModal();
            this.getCartList();  
        })
        .catch((err)=>{
            alert(err.data.message)
        })
       },
       getCartList(){
        const url="https://vue3-course-api.hexschool.io/v2/api/likefanzi/cart";
        axios.get(url)
        .then((res)=>{
            this.cart=res.data.data;
        })
        .catch((err)=>{
            alert(err.data.message)
        })
       },
       updateCartItem(item){//購物車id
        const url=`https://vue3-course-api.hexschool.io/v2/api/likefanzi/cart/${item.id}`;
        axios.put(url,{
            "data": {
              product_id:item.product_id,
              qty:item.qty            
            }})
        .then((res=>{
            alert(res.data.message);
            this.getCartList();
        }))
        .catch((err)=>{
            alert(err.data.message)
        })
       },
       deleteCart(id){
        const url=`https://vue3-course-api.hexschool.io/v2/api/likefanzi/cart/${id}`;
        axios.delete(url)
        .then((res)=>{
            alert(res.data.message);
            this.getCartList();
        })
        .catch((err)=>{
            alert(err.data.message)
        })
       },
       deleteAllCarts(){
        const url="https://vue3-course-api.hexschool.io/v2/api/likefanzi/carts";
        axios.delete(url)
        .then((res)=>{
            alert(res.data.message);
            this.getCartList();
        })
        .catch((err)=>{
            alert(err.data.message)
        })
       },
       onSubmit(){
        alert("已建立訂單")
       }
    },
    mounted(){
        this.getData();
        this.getCartList();
    }      
});
app.component("productModal",{
    template:"#userProductModal",
    props:["temp","addToCart"],
    data(){
        return{
            proModal:null, 
            qty:1   
        }
    },
    methods:{
       openModal(){
        this.proModal.show();
       },
       closeModal(){
        this.proModal.hide();
       }
    },
    mounted(){
        this.proModal = new bootstrap.Modal(document.getElementById('productModal'));
    }
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


app.mount('#app')