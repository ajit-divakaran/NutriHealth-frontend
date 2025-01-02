// import { useEffect, useRef, useState } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { addHeaderHeight, removeProfileDiv } from "../context/ContextShare";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  AddUserRecipeApi,
  GetAllFoodsApi,
  GetSearchFoodsinAddrecipesApi,
} from "../services/allApis";

const AddRecipesPage = () => {
  const { headHeight } = useContext(addHeaderHeight);
  const { show, setShow, setShowgoal } = useContext(removeProfileDiv);
  const [allrecipes, setAllrecipes] = useState([]);
  const [alluserrecipes, setAlluserrecipes] = useState([]);
  const [preview,setPreview] = useState(null)
  const [refreshStatus,setRefreshStatus] = useState({})
  const [userRecipeData,setUserRecipeData] = useState({
    food_name:"",
    calories:"",
    serving:"",
    serveUnit:"serving",
    protein:"",
    fat:"",
    carbs:"",
    foodimg:""
  })
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    
    setIsOpen(false)
    setPreview(null)
    setUserRecipeData({
      food_name:"",
      serving:"",
      serveUnit:"serving",
      calories:"",
      protein:"",
      fat:"",
      carbs:"",
      foodimg:""
    })
  };
  const navigate = useNavigate();

  console.log(headHeight);
  console.log(userRecipeData)

  const closeProfile = () => {
    if (show) {
      setShow(false);
      setShowgoal(false);
    }
  };

  const handleClear = () =>{
    setPreview(null);
    setUserRecipeData({
      food_name:"",
      calories:"",
      serving:"",
      serveUnit:"serving",
      protein:"",
      fat:"",
      carbs:"",
      foodimg:""
    })
  }
  const handleImg = (e) =>{
    const file = e.target.files[0]
    setUserRecipeData({...userRecipeData,foodimg:file})
    console.log(file)
    setPreview(URL.createObjectURL(file))
  }
  const getUserRecipes = async (token) => {
    const id = JSON.parse(sessionStorage.getItem("existingUser"))._id;
    console.log(id);
    console.log(token);
    const reqHeader = {
      "Content-type": "application/json",
     " Authorization": `Bearer ${token}`,
    };
    const result = await GetAllFoodsApi(reqHeader);
    console.log(result);
    if (result.status == 200) {
      const arr = result.data.allfoods;
      const dbfood = arr.filter((x) => x.userId != id);
      setAllrecipes(dbfood);
      console.log(allrecipes);
      const userfood = result.data.allfoods.filter((x) => x.userId == id);
      setAlluserrecipes(userfood);
      console.log(userfood);
    } else {
      console.log(result.response.data);
    }
  };

  const handleSearch = async (e) => {
    const search = e.target.value.trim();
    console.log(search);
    const result = await GetSearchFoodsinAddrecipesApi(search);
    console.log(result);
    if (result.status == 200) {
      setAllrecipes(result.data);
    } else {
      alert("Something went wrong");
    }
  };

  const handleAdd = async() => {
    
    const {food_name,calories,serving,serveUnit,protein,fat,carbs,foodimg} = userRecipeData
    console.log(foodimg)
    if(!food_name || !calories ||!serving || !protein || !fat || !carbs || !foodimg){
      alert("Please fill the form completely")
      
    }
    else{
      const reqBody = new FormData()
      reqBody.append('food_name',food_name)
      reqBody.append('calories',calories)
      reqBody.append('serving',serving)
      reqBody.append('serveUnit',serveUnit)
      reqBody.append('protein',protein)
      reqBody.append('fat',fat)
      reqBody.append('carbs',carbs)
      reqBody.append('foodimg',foodimg)
      
      const token= sessionStorage.getItem('token')
        const reqHeader = {
        "Content-type": "multipart/form-data",
       " Authorization": `Bearer ${token}`,
      };
  
      const result = await AddUserRecipeApi(reqBody,reqHeader)
      console.log(result)
      if(result.status == 200){
          setRefreshStatus(result)
          closeModal()
      }
      
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      console.log("Inside Add recipe page");
      getUserRecipes(sessionStorage.getItem("token"));
    } else {
      navigate("/nopage");
    }
  }, [refreshStatus]);

  // useEffect(()=>{
  //   if (sessionStorage.getItem("token")) {
  //     const {_id}= JSON.parse(sessionStorage.getItem("existingUser"))
  //     setUserRecipe({...userRecipe,userId:_id})
  //   }
  // },[])

  // useEffect(()=>{
  //   if(userRecipeData.foodimg)
  // },[])

  return (
    <>
      <Header color={"#9ED09B"} />
      <div
        className="bg-[#9ED09B] "
        style={{ minHeight: `calc(100vh - ${headHeight}px)` }}
        onClick={closeProfile}
      >
        <div className="flex justify-center gap-x-2 w-full">
          <div className="relative input-field">
            <input
              type="text"
              placeholder="Search foods here"
              className="mt-1 px-3 pl-7 py-3 text-md rounded-full w-[75vw] max-w-[35rem] caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
              onKeyUp={handleSearch}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/149/149852.png"
              alt="search"
              className="absolute right-5 top-4 w-[21px]"
            />
          </div>
          <button
            className="bg-transparent text-black hidden md:block hover:text-white hover:bg-black border border-black rounded-md px-2 ml-5 "
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Foods
          </button>
          <button
            className="bg-transparent text-black block md:hidden hover:text-white hover:bg-black border border-black rounded-md px-2 ml-5 "
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mx-3" />
          </button>
        </div>

        <div className=" flex flex-col items-center w-auto pb-40">
          {allrecipes?.length > 0 ? (
            <div className="w-[70%] lg:w-[90%] grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-8 mt-8 mb-20">
              {allrecipes.map((item) => (
                <Card key={item} fooditem={item} />
              ))}
            </div>
          ) : (
            <h1 className="text-center mt-5">No Data to show</h1>
          )}

          {alluserrecipes.length > 0 && (
            <>
              <h1 className="text-2xl w-[70%] lg:w-[90%]">User recipes</h1>
              <hr />
              <div className="w-[70%] lg:w-[90%] grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-8 mt-8">
                {alluserrecipes.map((item) => (
                  <Card key={item} fooditem={item} userrecipe={true} setRefreshStatus={setRefreshStatus} />
                ))}
              </div>
            </>
          )}

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                      
                      <img src={preview?preview:"https://cdn-icons-png.flaticon.com/128/3908/3908591.png"} alt="" className="h-[180px]" />
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
                      placeholder="Serving"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.serving}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,serving:e.target.value})}}
                    />
                    <select name="add-recipe" id="" onChange={(e)=>setUserRecipeData({...userRecipeData,serveUnit:e.target.value})}>
                      <option value="serving">serving</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-2">
                    
                    <span className="w-[20%] text-sm">Carbs:</span>
                    <input
                      type="number"
                      placeholder="Carbs"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.carbs}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="w-[20%] text-sm">Protein:</span>
                    <input
                      type="number"
                      placeholder="Protein"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.protein}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,protein:e.target.value})}}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="w-[20%] text-sm">Fats:</span>
                    <input
                      type="number"
                      placeholder="Fats"
                      className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                      value={userRecipeData.fat}
                      onChange={(e)=>{setUserRecipeData({...userRecipeData,fat:e.target.value})}}

                    />
                  </div>
                </div>
                <div className="float-end">
                  <button className="px-3 py-3 bg-[#3e4a3d] text-white text-sm rounded-md mt-2 mr-2" onClick={handleAdd}>Add Recipe</button>
                  <button className="px-4 py-3 bg-[#d3a350] text-black text-sm rounded-md mt-2 " onClick={handleClear}>Clear</button>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddRecipesPage;

{
  /* <div className="card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-[#769b73]" >
<img
  src="/public/images/Intersect.png"
  alt=""
  className="w-full up-down"
  ref={imgHeightRef}
/>
style={{height:`${gridHeightRef}`}}
<div className=" move relative bg-white" ref={gridHeightRef} >
  <div className="">
    <h2 className="text-lg font-medium tracking-wide">Meal name</h2>
    <p className="text-[#A50A0A]">1 serving</p>
    <p className="mt-2">
      <span className="font-medium">Calories</span>: 580kcal
    </p>
    <div className="flex gap-x-3 mt-2">
      <h2>
        <span className="text-[#02A395]">Protein</span> 5g
      </h2>
      <h2>
        <span className="text-[#98740A]">Fats</span> 1g
      </h2>
      <h2>
        <span className="text-[#6815B6]">Carbs</span> 20g
      </h2>
  </div>
  </div>
</div>
</div> */
}
