const express = require('express');
const mongoose=require('mongoose')
const MenuItem=require('./MenuItem.js')
const { resolve } = require('path');
const dotenv=require('dotenv').config()

const app = express();
const port = 3010;
app.use(express.json())
app.use(express.static('static'));
mongoose
.connect(process.env.DB_URL)
.then(()=>console.log('Database connected successfully'))
.catch((err)=>console.log('Database connection failed',err.message))

app.post('/menu',async(req,res)=>{
  const{name,description,price}=req.body;
  if(!name||!price){
    return res.status(400).json({message:'Name and price are required'})
  }
  try{
    const newMenuItem= new MenuItem({name,description,price});
    await newMenuItem.save();
    res.status(201).json({
      message:'Menu item created successfully'
    })
  }catch(err){
    res.status(500).json({message:'Failed to create menu item',error:err.message})
  }

})

app.get('/get_menu',async(req,res)=>{
  try{
    const menuItems=await MenuItem.find();
    res.status(200).json(menuItems)
  }catch(err){
    res.status(500).json({message:'Failed to fetch menu',error:err.message})
  }


})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
