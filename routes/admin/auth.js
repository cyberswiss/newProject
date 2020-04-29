const express = require('express');

const usersRepo = require('../../repos/users');

const router = express.Router();


router.get('/signup',(req,res)=>{
    //template string used to display ~ ``
 res.send(`
 
     <div>
    your id is: ${req.session.userId}
     <form method="POST"  >

     <input name="email"   placeholder="email"></input>

     <input name="password"   placeholder="password"></input>
     <input  name="confirmPass"   placeholder="confirm password"></input>
     <button >Sign Up</button>
     </form>
     
     </div>
 
 `);

});

router.post('/signup', async  (req,res)=>{
  //destructure the email,password and confirmPass properties from the req.body object
  const {email,password,confirmPass} = req.body;
  const existingUser = await usersRepo.getOneBy({email: email});
  if(existingUser){
      return res.send('Email in Use')
  }
  if(password !== confirmPass){
      return res.send('passwords must match');
  }
  //create the user
  const user =  await  usersRepo.create({email:email,password:password});

  //store the users id as a cookie and send it to the users browsers to include it in the follow up requests

  req.session.userId = user.id;

    res.send('account created');
})

router.get('/signout',(req,res)=>{
  req.session = null ;
  res.send('you are logged out')
})
router.get('/signin',(req,res)=>{

    res.send(
        `
<div>
  
<form method="POST"  >

<input name="email"   placeholder="email"></input>

<input name="password"   placeholder="password"></input>

<button >Sign in</button>
</form>

</div>

`
    );

   
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body;
     const user = await usersRepo.getOneBy({email:email});
     if(!user){
         return res.send('email not found');
     }

     const validPassword = await usersRepo.comparePasswords(
         user.password,
         password
     );
     if(!validPassword){
         return res.send('password invalid');
     }
      
     req.session.userId = user.id;
      res.send('you are signed in');

})

module.exports = router;