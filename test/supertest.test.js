const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Api Ecommerce', ()=>{

    describe('Test de Session',()=>{
        const monckUser = {
            
                
                "first_name": "test",
                "last_name": "test",
                "email": "test@gmail.com",
                "password": "654321",
                "role": "ADMIN",
                "cart": [],
                            
        }
     
        it('El endpoint Post /api/session/login debe logear a un usuario', (done)=>{
            let userData = {email : monckUser.email,password:monckUser.password};
            
            requester.post('/api/session/login/').send(userData)
           .expect(200)
           .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
           
                    	           	
        })    
    })
    describe('Test de productos',()=>{
        const productMock = {
            title: "producto Mock",
            description: "lalala",
            price: 300,
            thumbnail: "imagen1",
            code: 144,
            stock: 9,

        }
       
        it('El endpoint Post /api/products debe crear un producto', (done)=>{
            requester.post('/api/products/').send(productMock)
            .set('Accept', 'application/json')
           .expect(200)
           .then(res=>{
            productMock._id = res.body.product._id           
            done()
           })
           
                    	           	
        })    
        it('El endpoint Get /api/products debe traer todos los productos', (done)=>{
            requester.get('/api/products/')
           .expect(200, done)
                      	           	
        })
        it('El endpoint Get /api/products/:pid debe traer un producto segun el id', (done)=>{
            requester.get('/api/products/6413d018e007ede4844f1805')
           .expect(200, done) 	           	
                      	           	
        })    
     

        })
        
    })
