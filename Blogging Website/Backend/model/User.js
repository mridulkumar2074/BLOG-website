const mongoose= require('mongoose');

const UserSchema= mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            min:6,
            unique:true
        },
        password:{
            type:String,
            required:true,
            min:6
        }
    }

);
const User=mongoose.model("User",UserSchema);
module.exports=User;
