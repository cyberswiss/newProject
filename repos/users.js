 const fs= require('fs');
const crypto = require('crypto');
const util = require('util');
//promisifying 
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename){
        if(!filename){
            //the  constructor is passed a file name so that it searches t see if the file already exists .
            //the constructor only is checking a if a filename has been passed 
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
      try{
      //checking if the file  existes on the hard-drive
        fs.accessSync(this.filename);
      } catch{
          //if it does not exisit we are creating the file
       fs.writeFileSync(this.filename,'[]');
      }

    }
    //thid functions opens the file and returns all the data as a javascripts array to us
    async getAll() {
        //open the file called this.filename
        //read its content
    
     //  const contents = await fs.promises.readFile(this.filename,{
    // ad3465a8     encoding: 'utf8'
     //   });
    
        //parse its content
       // const data = JSON.parse(contents);
    
        //return the parsed data


//REFACTORED CODE SO THE EXTRA VARIABLES ARE NOT CREATED
     return JSON.parse(await fs.promises.readFile(this.filename,{
         encoding:'utf8'
     }));

 
      }
    //creates or adds data to the users.js files data array
      async create(attrs){
//addaing an id property to thr atters array
         attrs.id = this.randomId();
          //attrs is a object like  {email:raju@gmail.com,password:dyhgui}
//pasword salting and hashing
          const salt =crypto.randomBytes(8).toString('hex');
         const buf = await scrypt(attrs.password,salt,64);
          // ...attrs,password:bla bla    this syntax tells take the attrs object and all its properties same just update the password field to the new values
         const record = {
             ...attrs,
             password:`${buf.toString('hex')}.${salt}`
         };
          const records = await this.getAll();
          records.push(record);
          //write the updated records array back to the this.filename
        //  await fs.promises.writeFile(this.filename,JSON.stringify(records))   //  {functonality same as the write file method}
         await this.writeAll(records);
         //returns record object 
         return record;
      }

   async comparePasswords(saved,supplied){
       //saved => password saved in our database . 'hashed.salt'
       //supplied => password given to us by user trying to sign in
      // const result = saved.split('.');
      // const hashed = result[0];
      // const salt = result[1];
      const[hashed,salt] = saved.split('.');

      const hashedSuppliedBuff = await scrypt(supplied,salt,64);

      return hashed === hashedSuppliedBuff.toString('hex');

   }




//this method takes the commontask of writting the file and extracts it into a fnction so that we dont have to use repeated code
      async writeAll(records){
          //the second and third argument of stringify is for formatting the json file to readable ..the 2 is intentdation
           await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2));
      }

      //random id giving to all the users created
      randomId(){
        
        return crypto.randomBytes(4).toLocaleString('hex')
      }

      //getting one user method

      async getOne(id){
          const records = await this.getAll();
          return records.find(record => record.id === id);
      }

      //deleting a user
      async delete(id){
          const records = await this.getAll();
          //the one with id  is filtered out and the remaining or filtered array is passed to the write function
          const filteredRecords = records.filter( record => record.id != id);
          await this.writeAll(filteredRecords);
          const message = "Deleted Succesfully"
          return message;
      }

      //updating the user data WITH NEW DATA
      async update(id,attrs){
          const records = await this.getAll();
          const record = records.find(record => record.id === id);
          if(!record){
              throw new Error(`records not find with ${id } `);
          } else{
                //this function takes all the key value pairs from the attrs object and add them to the "record " object
          Object.assign(record,attrs);
          await this.writeAll(records);
          }
          
      }
  //getOneby  ...the filter method...returns the first user with a given filter...used to find a user

  //for of loop-----for iterating an array
  //for in loop-----for iterating through objects
  async getOneBy(filters){
    const records = await this.getAll();
     for( let record of records){
         let found = true ;
         for(let key in filters){
             if(record[key]!== filters[key]){
                 found = false;
             }
         }
         if (found){
             return record;
         }
     }
    
} 

}

module.exports = new UsersRepository('users.json');

//the other way of exporting is 

//module.exports = UserRepository;



//the file is created in the folder where we run the code 

//this is the testing codes
//const test = async ()=>{
  
//const repo =   new UsersRepository('users.json');
//  await   repo.create({email:'pranit@gmail.com',password:'password'})
    //  const users =  await repo.getAll();
//const user = await repo.getOneBy({email: 'pranits@gmail.com'});

   //  console.log(user);

//}
// test();