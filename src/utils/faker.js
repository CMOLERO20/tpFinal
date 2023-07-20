const {faker} = require('@faker-js/faker');



const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(1),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.datatype.uuid(),
        stock: faker.random.numeric(2),

    }
}

const generate100Product = () => {
    let products = [];
    
    for(let index=0; index < 10 ; index++){
        products.push(generateProduct())
    }
    
    return products;

}
  

module.exports = {generateProduct,generate100Product};