import React, { useEffect, useState } from "react";
import { serverUrl } from "../services/serverUrl";
import { DeleteUserFoodApi, EditUserRecipeApi } from "../services/allApis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Card = ({fooditem,setRefreshStatus}) => {
  // const [editisClicked,setEditIsClicked]
  const [isOpen, setIsOpen] = useState(false);
  const [preview,setPreview] = useState(null);

  const [userRecipeData,setUserRecipeData] = useState({
    food_name:fooditem.food_name,
    calories:fooditem.calories,
    serving:fooditem.serving,
    serveUnit:fooditem.serveUnit,
    protein:fooditem.protein,
    fat:fooditem.fat,
    carbs:fooditem.carbs,
    foodimg:""
  })


  const openModal = () => {setIsOpen(true)
    document.body.style.overflow = "hidden"
  };
  const closeModal = () => {
    
    setIsOpen(false)
  setPreview(null)
setUserRecipeData({
  food_name:fooditem.food_name,
  calories:fooditem.calories,
  serving:fooditem.serving,
  serveUnit:fooditem.serveUnit,
  protein:fooditem.protein,
  fat:fooditem.fat,
  carbs:fooditem.carbs,
  foodimg:""
})
document.body.style.overflow = "auto"
}

    const handleImg = (e) =>{
      const file = e.target.files[0]
      setUserRecipeData({...userRecipeData,foodimg:file})
      // setImg(file)
      setPreview(URL.createObjectURL(file))
    }
    const handleUpdateData = async()=>{
      if(sessionStorage.getItem('token')){
      console.log(userRecipeData)
      const {food_name,calories,serving,serveUnit,protein,fat,carbs,foodimg} = userRecipeData
      const reqBody = new FormData()
      reqBody.append("food_name",food_name)
      reqBody.append("calories",calories)
      reqBody.append("serving",serving)
      reqBody.append("serveUnit",serveUnit)
      reqBody.append("protein",protein)
      reqBody.append("fat",fat)
      reqBody.append("carbs",carbs)
      reqBody.append("foodimg",foodimg)

      const token = sessionStorage.getItem('token')
      const reqHeader = {
        "Content-type": "multipart/form-data",
       " Authorization": `Bearer ${token}`,
      };
      const result = await EditUserRecipeApi(fooditem._id,reqBody,reqHeader) 
      console.log(result)
      if(result.status == 200){
        setRefreshStatus(result.data)
        document.body.style.overflow = "auto"
        setIsOpen(false)
      }
      else if(result.status == 406){
        alert("Edit was unsucessful")
      }
      else{
        alert("Something went wrong")
      }

}     else{
  alert("Something is wrong data not found")
}
    }

    const handleDelete = async()=>{
      if(sessionStorage.getItem('token')){
        const token = sessionStorage.getItem('token')
        const reqHeader = {
          "Content-type": "application/json",
         " Authorization": `Bearer ${token}`,
        };
        console.log(reqHeader)
        const foodId = fooditem._id; //674cd078b98ec722a1a6be33
        console.log(foodId)
        const result = await DeleteUserFoodApi(foodId,reqHeader)
        console.log(result)
        if(result.status == 200){
          setRefreshStatus(result.data)
        }
      }
      else{
        alert("No valid user found")
      }
    }

  
  return (
  
    <div className="card bg-white rounded-lg shadow-lg overflow-hidden relative hover:shadow-[#769b73]" >
{/* {     userrecipe &&  */}
<div>
  <div className="edit rounded-full px-2 py-1 bg-[#ffffffe7] absolute -top-[40px] left-[10px] text-black border border-black hover:cursor-pointer hover:bg-[#ce825e] " onClick={openModal}>Edit Recipe</div>
  <div className="edit trashcolor absolute right-[15px] -top-[40px] bg-[#ffffffe7] px-3 py-1 rounded hover:bg-red-500"><FontAwesomeIcon icon={faTrashAlt} className=" icon text-black" onClick={handleDelete}/></div>
  </div>
{/* } */}

 <img
    src={
      fooditem.userId
      ?
      `${serverUrl}/upload/${fooditem.foodimg}`
    :
    fooditem.foodimg
  }
    alt=""
    className="w-full up-down h-[175px]"
    
   
  />


<div className=" move relative bg-white"  >
  <div className="">
    <h2 className="text-lg font-medium tracking-wide">{fooditem.food_name}</h2>
    <p className="text-[#A50A0A]">{fooditem.serving} {fooditem.serveUnit}</p>
    <p className="mt-2">
      <span className="font-medium">Calories</span>: {fooditem.calories}kcal
    </p>
    <div className="flex gap-x-3 mt-2">
      <h2>
        <span className="text-[#02A395]">Protein</span> {fooditem.protein}g
      </h2>
      <h2>
        <span className="text-[#98740A]">Fats</span> {fooditem.fat}g
      </h2>
      <h2>
        <span className="text-[#6815B6]">Carbs</span> {fooditem.carbs}g
      </h2>
  </div>
  </div>
</div>
{isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="bg-white p-6 rounded shadow-lg relative w-[85%] md:w-1/2 md:max-w-[30rem]">
                <div className="flex justify-between items-center">
                  <h3>Add Recipe</h3>
                  <div className="bg-slate-100 rounded-md flex justify-center items-center p-2 hover:bg-slate-200" onClick={closeModal}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/3388/3388658.png"
                      alt=""
                      width="15px"
                    />
                  </div>
                </div>
                <hr className="h-[2px] mt-2 bg-slate-100 ps-3" />

                <div>
                  <div className="w-[100%] flex justify-center mt-2">
                    <label htmlFor="foodImage" className="text-center" >
                      Select image
                      <input type="file" id="foodImage" className="hidden border" onChange={handleImg} />
                      {console.log(fooditem.foodimg)}
                      <img src={preview?preview:(fooditem.userId?`${serverUrl}/upload/${fooditem.foodimg}`:fooditem.foodimg)} alt="" className="h-[180px]" />
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="w-[20%] text-sm">Food name:</span>
                    <input
                      type="text"
                      placeholder="Food Name"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.food_name}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,food_name:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                  {/* {console.log(typeof fooditem.calories)} */}
                    <span className="w-[20%] text-sm">Calories:</span>
                    <input
                      type="number"
                      placeholder="Calories"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.calories}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,calories:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
               
                    <span className="w-[20%] text-sm">Serving:</span>
                    <input
                      type="number"
                      placeholder=""
                      className=" px-1 py-2 w-[55%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.serving}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,serving:e.target.value})}}
                    />
                    <select name="" id="" className="bg-slate-100 w-[20%] ms-[5%]">
                    {fooditem.serveUnit=='serving'?
                   <>
                      <option value={'serving'} >serving</option>
                      <option value={'g'} >g</option>
                   </>
                  :
                 <>
                    <option value={'g'}>g</option>
                    <option value={'serving'} >serving</option>
                 </>
                  }
                    </select>
                  </div>
                  <div className="flex items-center mt-2">
                    
                    <span className="w-[20%] text-sm">Carbs:</span>
                    <input
                      type="number"
                      placeholder="Carbs"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.carbs?userRecipeData.carbs:fooditem.carbs}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="w-[20%] text-sm">Protein:</span>
                    <input
                      type="number"
                      placeholder="Protein"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.protein?userRecipeData.protein:fooditem.protein}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,protein:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="w-[20%] text-sm">Fats:</span>
                    <input
                      type="number"
                      placeholder="Fats"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.fat?userRecipeData.fat:fooditem.fat}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,fat:e.target.value})}}

                    />
                  </div>
                </div>
                <div className="float-end">
                  <button className="px-3 py-3 bg-[#3e4a3d] text-white text-sm rounded-md mt-2 mr-2" onClick={handleUpdateData}>Update Recipe</button>
                  {/* <button className="px-4 py-3 bg-[#d3a350] text-black text-sm rounded-md mt-2 " onClick={handleClear}>Clear</button> */}
                  
                </div>
              </div>
            </div>
          )}
</div> 
  );
};

export default Card;
