const express=require('express');
const router=express.Router();
const User=require('../modules/User')
// for validation 
const {body,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const fetchuser=require('../midlleware/fetchuser')

const JWT_SCRET="GOVINDisGOODboy"

//ROUTE : 1:=>Create a user using POST: endpoint "/api/auth/createuser" Dos'nt require Auth
router.post('/createuser',[
    body('name',"Enter a valid Name").isLength({ min: 3 }),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Enter the password having min length 8").isLength({ min: 8 }),
], async(req,res)=>{
  let success=false;
  // If there are errors return bad requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try{
      //check wheather email exists already
    let user=await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({success,error:"Sorry a user with this email already exists"})
    }

    // genterating salt 
    const salt = await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt);
    user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      });
      const data={
        user:{
          id:user.id
        }
      }
    const authtoken=jwt.sign(data,JWT_SCRET);
    console.log(authtoken);
    // res.json({authtoken}) 
    success=true;
    res.json({success,authtoken});
    }
    catch(error){
      console.log(error.message);
      res.status(500).send("Some error occured");

    }
})


//ROUTE : 2:=>Authentication a User using POST "/api/auth/login" No loggedin Required 

router.post('/login',[
  body('email',"Enter a valid email").isEmail(),
  body('password',"Password can'nt be blank").exists(),
], async(req,res)=>{
  let success=false;
  // If there are errors return bad requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password}=req.body;
  try{
    let user= await User.findOne({email});
    if(!user){
      success=false
      return res.status(400).json({success,error:"Please try to login with correct credential"});
    }
    const passwordCompare=await bcrypt.compare(password,user.password)
    if(!passwordCompare){
      success=false
      return res.status(400).json({success,error:"Please try to login with correct credential"});
    }
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SCRET);
    success=true
    res.json({success,authtoken})
  }
  catch(error){
    console.log(error.message);
    res.status(500).send("Internal Sever Error");

  }
}
)


// ROUTE : 3:=> Get User details loggedin  using POST "/api/auth/getuser" Login Requried 
router.post('/getuser',fetchuser, async(req,res)=>{
  try {
    // we need to fetch userId{ we have to decode authtoken and get the value of ID}(all request that want to user to be authenticate i will send a header of authentication token, now from that header i will fetch the data )
    userId=req.user.id;
    const user=await User.findById(userId).select("-password") // we can get all the details execpt the password
    res.send(user)
  } catch(error){
    console.log(error.message);
    res.status(500).send("Internal Sever Error");
  
  }
}
)

module.exports=router


//MIDleware => is a function which is called whenver the request will come on login routs