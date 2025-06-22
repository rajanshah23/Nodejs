const express =require("express")
const app=express()

// We can also do like this 
// const app=require("express")()

const PORT=3000
app.use(express.json())

//templaing engine(Backend batai frontend render garna we use either(ejs,pug,handlebar,moustache))
app.set('view engine','ejs')

app.get("/",(req,res)=>{
    const name="Rajan Gupta"
    res.render('home.ejs',{data:name})
    
})

app.get("/about",(req,res)=>{
    res.render('about')

})
 app.listen( PORT,()=>{
    console.log(`server has startd at http://localhost:${PORT}`);
    
})
 
