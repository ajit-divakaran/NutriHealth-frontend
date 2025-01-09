  import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import StatusBar from "../components/StatusBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import Diet from "../components/Diet";
import { addHeaderHeight, removeProfileDiv } from "../context/ContextShare";
import { useNavigate } from "react-router-dom";
import { AddSearchCacheFoodsApi, AddUSDAEditedImageApi, EditUserMealApi, FindUSDAFoodApi, GetSearchFoodsinAddrecipesApi, GetUserMealsOfTheDayApi } from "../services/allApis";
import axios from "axios";
import { serverUrl } from "../services/serverUrl";
import { toast, ToastContainer } from "react-toastify";

// import NutriData from "../components/NutriData";

const NutritionPage = () => {
  const { headHeight } = useContext(addHeaderHeight);
  // const inputRef = useRef(null)
  const [rightDivHeight,setRightDivHeight] = useState(0)
  const [type, setType] = useState("text");
  const [addFood,setaddFood] = useState(false)
  const [disableNutritionalPage, setDisableNutritionalPage] = useState(false);
  const [currentUSDA,setCurrentUSDA] = useState({
    food_id:'',    
    food_name:'',
    serving:'',
    serveUnit:'',
    calories:1,
    protein:1,
    fat:1,
    carbs:1,
    foodimg:''})
  const [goals, setGoals] = useState({
    calories: 1,
    protein: 1,
    carbs: 1,
    fats: 1,
  });
  const [previewImg,setPreviewImg] = useState()
  const [isChangedImage,setIsChangedImage] = useState(null)

  const options = { day: "2-digit", month: "long", year: "numeric" };
  const date = new Intl.DateTimeFormat("en-GB", options).format(new Date());
  const [userDate, setUserDate] = useState(date);
  const [showFoodClick, setShowFoodClick] = useState(false)
  const navigate = useNavigate();

  const { show, setShow, setShowgoal } = useContext(removeProfileDiv);
  const [inputValue, setInputValue] = useState('');
  const [searchlist, setSearchlist] = useState([]);
  const [searchInnateList, setSearchInnateList] = useState([])
  // const [foodimage,setFoodimage] = useState('')

  const [USDACurrentDetails,setUSDACurrentDetails] = useState({
    food_id:'',
    food_name:'',
    serving:'',
    serveUnit:'',
    calories:'',
    protein:'',
    fat:'',
    carbs:'',
    customServing:'',
    foodimg:''
  })

  const [isMeasuresPresent,setIsMeasuresPresent] = useState(null)

  const [refreshStatus,setRefreshStatus] = useState({})
  const [mealTime,setMealTime] = useState('')

  const handleDate = (e) => {
    const date = e.target.value;
    console.log(date.length);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const dateobj = new Date(date).toLocaleDateString("en-GB", options);
    setUserDate(dateobj);
    console.log(typeof dateobj);
    setType("text");
  };

  const clickIn = () => {
    setType("date");
  };
  const clickOut = () => {
    setType("text");
  };

  const closeProfile = () => {
    if (show) {
      setShow(false);
      setShowgoal(false);
    }
  };

  console.log('User date', userDate)

  const getGoals = () => {
    if (JSON.parse(sessionStorage.getItem("existingUser")).goals.length > 0) {
      let calories =
        JSON.parse(sessionStorage.getItem("existingUser")).goals[0].calories *
        1;
      const carbs =
        JSON.parse(sessionStorage.getItem("existingUser")).goals[0].carbs * 1;
      const protein =
        JSON.parse(sessionStorage.getItem("existingUser")).goals[0].protein * 1;
      const fats =
        JSON.parse(sessionStorage.getItem("existingUser")).goals[0].fats * 1;
      console.log(typeof calories, calories);
      setGoals({ calories, protein, carbs, fats });
      console.log("Goal calories", goals.calories);
    } else {
      setDisableNutritionalPage(true);
    }
    // console.log(calories)
  };

  const adjustRightDivHeight = () => {
    console.log('height')
    const leftDiv = document.getElementById("leftDiv");
    // const rightDiv = document.getElementById("rightDiv");
    if(leftDiv){console.log("left",leftDiv.offsetHeight)
    setRightDivHeight(leftDiv.offsetHeight)}
    // console.log(rightDiv.style.height)
    
      
    
  };


  
const [FDCid ,setFDCid] = useState(0)
const calculateValues = (serving,weight) =>{
  console.log("Weight",weight)
  let newCalories = ''
  let newCarbs = ''
  let newFats = ''
  let newProtein = ''
  console.log(currentUSDA)

    if(weight && !(currentUSDA.serveUnit=='serving') )
    { newCalories = ((currentUSDA.calories*weight)/100).toFixed(2)
     newCarbs = ((currentUSDA.carbs*weight)/100).toFixed(2)
     newFats = ((currentUSDA.fat*weight)/100).toFixed(2)
     newProtein = ((currentUSDA.protein*weight)/100).toFixed(2)}
    
    if(currentUSDA.serveUnit=='serving'){
      newCalories = currentUSDA.calories*weight
     newCarbs = currentUSDA.carbs*weight
     newFats = currentUSDA.fat*weight
     newProtein = currentUSDA.protein*weight
    }
    console.log("New cal",newCalories)


    setUSDACurrentDetails({...USDACurrentDetails,serving:serving,calories:newCalories,carbs:newCarbs,fat:newFats,protein:newProtein,customServing:serving=='Custom'?weight:''})
    // console.log(USDACurrentDetails)
}

const firstCalculate = (details,weight) =>{
  console.log("Weight",weight)
  let newCalories = ''
  let newCarbs = ''
  let newFats = ''
  let newProtein = ''
  console.log(details)
  console.log(details.calories,weight,(details.calories*weight)/100)
    if(weight && !(details.serveUnit=='serving') )
    { newCalories = ((details.calories*weight)/100).toFixed(2)
     newCarbs = ((details.carbs*weight)/100).toFixed(2)
     newFats = ((details.fat*weight)/100).toFixed(2)
     newProtein = ((details.protein*weight)/100).toFixed(2)}
    
    if(details.serveUnit=='serving'){
      newCalories = details.calories*weight
     newCarbs = details.carbs*weight
     newFats = details.fat*weight
     newProtein = details.protein*weight
    }
    console.log("New cal",newCalories)

    setUSDACurrentDetails({food_id:details.food_id,food_name:details.food_name,serving:details.serving,customServing:'',serveUnit:details.serveUnit,calories:newCalories,carbs:newCarbs,fat:newFats,protein:newProtein,foodimg:details.foodimg})
}

const handleMeasures = (item) =>{
  console.log('Inside Handle Measures')
  setIsMeasuresPresent(item)
  // setTempGramMeasure(item[0].disseminationText)
  // setTempGramWeight(item[0].gramWeight)
  return `${item[0].disseminationText} (${item[0].gramWeight}g)`
}

  const handleFoodClick = async(item) =>{
    setShowFoodClick(true)
    setPreviewImg(null)
    console.log(item._id?`item_id:${item._id}`:`fdcid:${item.fdcId}`)
    if(item.fdcId)
      {setFDCid(item.fdcId)
        
      }
    else{
      setFDCid(null)
    }
    adjustRightDivHeight();
    console.log(item.foodimg)
    console.log(item.serving?item.serving:(item.foodMeasures.length>0?handleMeasures(item.foodMeasures):100))
    const check = isChangedImage.findIndex(x=>x.fdcId==item.fdcId)
    console.log(check)
    console.log(typeof item.protein )
    const details = {  
      food_id:item._id?item._id:item.fdcId,
      food_name:item.food_name?item.food_name:item.description,
      serving:item.serving?item.serving:(item.foodMeasures.length>0?handleMeasures(item.foodMeasures):100),
      serveUnit:item.serveUnit||((item.servingSizeUnit=='GRM'?'g':(item.servingSizeUnit=='MLT'?'ml':item.servingSizeUnit))??'g'),
      
      calories: item.calories == 0 ? 0: item.calories ??item.calories?item.calories: item.foodNutrients.find(x=>x.nutrientId==1008 || x.nutrientId==2047)?((item.servingSize)?item.servingSize:item.foodNutrients.filter(x=>x.nutrientId==1008||x.nutrientId==2047)[0].value):'--',
      
      protein: item.protein == 0 ? 0 :item.protein  ?? item.protein?item.protein:item.foodNutrients.find(x=>x.nutrientId==1003)?item.foodNutrients.filter(x=>x.nutrientId==1003)[0].value:'--',
      
      fat: item.fat == 0 ? 0: item.fat ?? item.fat?item.fat: item.foodNutrients.find(x=>x.nutrientId==1004)?item.foodNutrients.filter(x=>x.nutrientId==1004)[0].value:'--',
      
      carbs: item.carbs == 0? 0: item.carbs ?? item.carbs?item.carbs:item.foodNutrients.find(x=>x.nutrientId==1005)?item.foodNutrients.filter(x=>x.nutrientId==1005)[0].value:'--',
      
      customServing:'',
      
      foodimg:item.foodimg?`${serverUrl}/upload/${item.foodimg}`:(check!== -1?`${serverUrl}/upload/${isChangedImage[check].foodimg}` :await fetchPexelsData(item.description))
    }
    console.log(typeof details.serving)
    console.log(details)
   
    
    if(typeof details.serving == 'number' || details.serving.split(' ').length==1){
      setIsMeasuresPresent(null)
      console.log("Flagged")
      setUSDACurrentDetails(details)
    }
    else{
      console.log('Inside else')
      firstCalculate(details,item.foodMeasures[0].gramWeight)
    }
    setCurrentUSDA(details) // for reference after first render of USDACurrentDetails
   

  }





  const handleFoodClose = () =>{
    setShowFoodClick(false)
  }

  const handleAddmealClose = ()=>{
    setSearchInnateList([])
    setSearchlist([])
    setInputValue('')
    setShowFoodClick(false)
    setUSDACurrentDetails({
      food_id:'',
      food_name:'',
      serving:'',
      serveUnit:'',
      calories:'',
      protein:'',
      fat:'',
      carbs:'',
      foodimg:''
    })
      setaddFood(false)

  }

  console.log(USDACurrentDetails)

  const [animation,setAnimation] = useState(false)

  const handleAddMeal = async() =>{
    setAnimation(false)
    const {food_id,food_name,serving,serveUnit,calories,carbs,protein,fat,foodimg,customServing} = USDACurrentDetails
          if((serving=='Custom'&& !customServing) || (serving!='Custom' && !serving)){
            alert("Please Enter the serving")
          }
          else{

          console.log('Mealtime : ',mealTime)
          console.log('food id:',food_id)
          const reqBody = new FormData()
          reqBody.append('food_id',food_id)
          reqBody.append('food_name',food_name)
          reqBody.append('calories',calories)
          reqBody.append('serving',serving)
          reqBody.append('serveUnit',serveUnit)
          reqBody.append('protein',protein)
          reqBody.append('fat',fat)
          reqBody.append('carbs',carbs)
          reqBody.append('mealtime',mealTime)
          reqBody.append('date',userDate)
          reqBody.append('customServing',customServing)

          if(foodimg instanceof File){
            console.log('Instance of file')
            reqBody.append('foodimg',foodimg)
          }
          else{
            reqBody.append('foodimg',foodimg)
          }

          console.log(reqBody)


          const token= sessionStorage.getItem('token')
          console.log(token)
            const reqHeader = {
            "Content-type": "multipart/form-data",
           "Authorization": `Bearer ${token}`,
          };
      
          const result = await EditUserMealApi('edit',reqBody,reqHeader)          
          console.log("Edit user meal",result)
          if(result.status == 200){
              setRefreshStatus(result)
              // toast.success(`Added meal to ${mealTime}`)
              alert('Added meal successfully')
              sessionStorage.setItem('UsermealsToday',JSON.stringify(result.data))
              setUserMeals(JSON.parse(sessionStorage.getItem('UsermealsToday')))
              console.log("Preview image",previewImg)
              if(previewImg)
                {
                 const reqbod = new FormData()
                 reqbod.append('fdcId',FDCid)
                 reqbod.append('foodimg',USDACurrentDetails.foodimg)  
                  
                 const res = await AddUSDAEditedImageApi(reqbod,reqHeader)
                 console.log("changedimage",res)
                if(res.status==200){
                console.log('Updated user changedImage')
                // const obj = JSON.parse(sessionStorage.getItem('existingUser'))
                // obj.changedImages = 
                console.log(res.data.existingUser)
                sessionStorage.setItem('existingUser',JSON.stringify(res.data.existingUser))
              }
            }
            setSearchInnateList([])
            setSearchlist([])
            setInputValue('')
            setShowFoodClick(false)
            setUSDACurrentDetails({
              food_id:'',
              food_name:'',
              serving:'',
              serveUnit:'',
              calories:'',
              protein:'',
              fat:'',
              carbs:'',
              foodimg:''
            })
              setaddFood(false)
              setAnimation(true)



          }
          else{
            alert('Oops something went wrong')
            setSearchInnateList([])
            setSearchlist([])
            setInputValue('')
            setShowFoodClick(false)
            setUSDACurrentDetails({
              food_id:'',
              food_name:'',
              serving:'',
              serveUnit:'',
              calories:'',
              protein:'',
              fat:'',
              carbs:'',
              foodimg:''
            })
              setaddFood(false)
              setAnimation(true)
          }


        }

    

  }

const [isLoading,setIsLoading] = useState(true)
 // useeffect for api call with delay
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log('Input event triggered after 2 seconds of inactivity:', inputValue);
      handleApiCall(inputValue)
    }, 2000);
    
    // Cleanup function to clear the timeout if inputValue changes
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);



  
  const handleApiCall = async(val)=>{
    console.log("api call",val);
    setPreviewImg(null)
    if(val.length){
      setIsLoading(true)
    const pro1 = await GetSearchFoodsinAddrecipesApi(val)
    console.log(pro1.data)
    setSearchInnateList(pro1.data)
    const data = JSON.parse(sessionStorage.getItem('existingUser')).searchedfoods
    console.log(data)
    if(!data || !data[val]){
    const dataTypes = ['Branded', 'SR Legacy', 'Survey (FNDDS)', 'Foundation'];
    console.log("Input",inputValue)
    const res = await Promise.all(dataTypes.map(type=>FindUSDAFoodApi(type,inputValue))) 
    
    // const pro = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${val}&pageSize=50&sortBy=lowercaseDescription.keyword&sortOrder=asc&api_key=${apikey}`)
    // const res = await pro.json()
    console.log(res)
    const Branded = res[0].data.foods.length>10?res[0].data.foods
    
    .filter(x => 
        { 
          const words = x.description.split(" "); 
          const upperVal = val.toUpperCase(); 
          const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1); 
          return words.includes(upperVal) 
          || words.includes(val) 
          || words.includes(capitalizedVal)
        })
          .sort((a,b)=> a.ingredients.length - b.ingredients.length )
          .slice(0,4)
          :res[0].data.foods;
    // const Brand1 = res[0].data.foods.length>10?res[0].data.foods.slice(0,10):res[0].data.foods;
    const SRLegacy = res[1].data.foods.length>5?res[1].data.foods
    .filter(x => 
      { 
        const words = x.description.split(" "); 
        const upperVal = val.toUpperCase(); 
        const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1); 
        return words.includes(upperVal) 
        || words.includes(val) 
        || words.includes(capitalizedVal)
      })
    // .sort((a,b)=> a.ingredients.length - b.ingredients.length )
    .slice(0,6)
    :res[1].data.foods;
    const Survey = res[2].data.foods.length>3?res[2].data.foods
    .filter(x => 
      { 
        const words = x.description.split(" "); 
        const upperVal = val.toUpperCase(); 
        const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1); 
        return words.includes(upperVal) 
        || words.includes(val) 
        || words.includes(capitalizedVal)
      })
      // .sort((a,b)=> a.ingredients.length - b.ingredients.length )
      .slice(0,3)
    :res[2].data.foods;
    const Foundation = res[3].data.foods.length>10?res[3].data.foods
    .filter(x => 
      { 
        const words = x.description.split(" "); 
        const upperVal = val.toUpperCase(); 
        const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1); 
        return words.includes(upperVal) 
        || words.includes(val) 
        || words.includes(capitalizedVal)
      })
        .sort((a,b)=> a.ingredients.length - b.ingredients.length )
        .slice(0,10)
    :res[3].data.foods
    

    console.log(Branded,SRLegacy,Survey,Foundation)
    const arr = [...Branded,...SRLegacy,...Survey,...Foundation]
    if(arr.length>=0){
      setIsLoading(false) 
      console.log('Loading done')
    }
    console.log(arr)
    // const res1 = item.foods.sort((a,b)=> a.finalFoodInputFoods.length - b.finalFoodInputFoods.length ).filter(x => 
    //   { 
    //     const words = x.description.split(" "); 
    //     const upperVal = val.toUpperCase(); 
    //     const capitalizedVal = val.charAt(0).toUpperCase() + val.slice(1); 
    //     return words.includes(upperVal) || words.includes(val) || words.includes(capitalizedVal)})
    // .filter(x=>x.description.split(" ").includes(`${val.toUpperCase()}`))
    // 

    // console.log(res1)
    setSearchlist(arr)
   
    if(sessionStorage.getItem('token') && arr.length>0){
      const token = sessionStorage.getItem('token')
      const reqHeader = {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`}
    const result = await AddSearchCacheFoodsApi({search:val,data:arr},reqHeader)
    console.log(result.data)
      sessionStorage.setItem('existingUser',JSON.stringify(result.data.existingUser))
    
  }

  }
  else{
    const res = data[val]
    console.log(res)
    setSearchlist(res)
    setIsLoading(false)
  }

  }
    else{
      setSearchInnateList([])
      setSearchlist([])
      setIsLoading(false)
    }
    
  }

  const handleChange = (event) => {
    setInputValue(event.target.value);
   
  };



 const handleSingleServingInput = (e) =>{
  setUSDACurrentDetails({...USDACurrentDetails,serving:e.target.value})
  calculateValues(e.target.value,e.target.value)
 }

  const handleCustomInputValue = (e) =>{


      const val = e.target.value
      if(val>0 || !val.length){

        calculateValues('Custom',val)
      }

    
  }


  const handleInputCursorAndOptionChange = (e) =>{
    const selectedVal = e.target.value
    console.log(selectedVal)
      const selectedWeight = e.target.selectedOptions[0].dataset.weight;
      console.log(selectedWeight)
      calculateValues(selectedVal,selectedWeight)
    
    
    // if(selectedVal=='Custom'){
    //   inputRef.current.focus()
    // }
  }


  // console.log(debouncedValue)

  const handlePreviewImage = (e) =>{
    const file = e.target.files[0]
    const urlImg = URL.createObjectURL(file)
    setUSDACurrentDetails({...USDACurrentDetails,foodimg:file})
    setPreviewImg(urlImg)
    console.log(urlImg)
  }

 


  const fetchPexelsData = async (searchQuery) => {
    const API_KEY = "yweHSnFyN8hre8ANvjAM85HyNn09A7gqyaJ557Ngzl0tlDqsOghX9RF7"; 
    const url = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=25`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: API_KEY // Include the API key in the headers
            }
        });
        console.log("Pexels Data:", response.data.photos.sort((a,b)=> a.alt.split(' ').indexOf(searchQuery)-b.alt.split(' ').indexOf(searchQuery)));
        // setFoodimage(response.data.photos.sort((a,b)=> a.alt.split(' ').indexOf(searchQuery) - b.alt.split(' ').indexOf(searchQuery))[1].src.original)
        return response.data.photos.sort((a,b)=> a.alt.split(' ').indexOf(searchQuery) - b.alt.split(' ').indexOf(searchQuery))[1].src.original;
    } catch (error) {
        console.error("Error fetching Pexels data:", error);
        throw error;
    }
};

const getChangedImages = ()=>{
  const check = JSON.parse(sessionStorage.getItem('existingUser')).changedImages

  if(check){
    setIsChangedImage(check)
  }
  

}

console.log(isChangedImage)

const firstTimeUserMeals = async()=>{
  const token= sessionStorage.getItem('token')
  console.log(token)
    const reqHeader = {
    "Content-type": "multipart/form-data",
   "Authorization": `Bearer ${token}`,
  };
  const result =  await GetUserMealsOfTheDayApi(userDate,reqHeader)
  console.log(result.data)
  if(result.status == 200){
    sessionStorage.setItem('UsermealsToday',JSON.stringify(result.data))
    setUserMeals(result.data)
  }
  else{
    setUserMeals([])
    const data = sessionStorage.getItem('UsermealsToday')
    // const data1 = sessionS
    if(data){
      sessionStorage.removeItem('UsermealsToday')
    }
  }
  // setTimeout(()=>getCurrentGoalValues(),1000)
  getCurrentGoalValues()
  setAnimation(true)
}

const getCurrentGoalValues = () =>{
  const data = sessionStorage.getItem('UsermealsToday')
  console.log(data)
  let calories = 0;
  let protein = 0;
  let fats = 0;
  let carbs = 0;
  let arr = JSON.parse(data)
  if(arr){ 
   
  for(let x in arr){
    if(x=='breakfast' || x=='dinner' || x=='snacks' || x=='lunch'){
      arr[x].forEach(p=>{
        calories += p.calories!=='--'?p.calories*1:0;
        protein += p.protein!=='--'?p.protein*1:0;
        fats += p.fat!=='--'?p.fat*1:0;
        carbs += p.carbs!=='--'?p.carbs*1:0;

      })
      }  
    }
  }
    let objdata = {calories:calories.toFixed(2)*1,protein:protein.toFixed(2)*1,fats:fats.toFixed(2)*1,carbs:carbs.toFixed(2)*1}
    sessionStorage.setItem('usernutrition',JSON.stringify(objdata))
    console.log('calories',calories)
    console.log('protein',protein)
    console.log('fats',fats)
    console.log('carbs',carbs)

  }


useEffect(()=>{
  setAnimation(false)
  firstTimeUserMeals()
 
},[userDate])

const [userMeals,setUserMeals] = useState({})
//main useEffect
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      console.log("Inside Nutrition page");
      getGoals();
      getCurrentGoalValues()
      getChangedImages()
      adjustRightDivHeight();
      let data = sessionStorage.getItem("UsermealsToday")
      if(data){
        data = JSON.parse(sessionStorage.getItem("UsermealsToday"))
        console.log(data)
        setUserMeals(data)
        setAnimation(true)
      }
      window.addEventListener("resize", adjustRightDivHeight);
    
    
    
    } else {
      navigate("/nopage");
    }
    return () => {
      window.removeEventListener("resize", adjustRightDivHeight);
    };
 
  }, [refreshStatus]);
  return (
    
    <div className="h-auto">
      <Header color={"#d7cfbf"} />
      {console.log(USDACurrentDetails)}
      {console.log(searchInnateList)}

      {!disableNutritionalPage ? (
        <div
          className="bg-[#d7cfbf] h-auto w-100 flex justify-center"
          onClick={closeProfile}
        >
          <div className=" w-[90%] md:w-[85%]">
            <div className="z-10 flex justify-center w-100 ">
              <h1 className="text-2xl">Your Nutritional Info</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] grid-rows-1 md:grid-rows-[1vw_auto_1vw] w-100 mt-8">
              <div className="w-full md:w-[60%] content-container mx-auto md:col-start-1 md:row-start-2 bg-[#2F4858] text-white px-3 py-3 rounded-md">
                <img src="/images/calendar.png" alt="" />
                <div className="flex items-center mt-2">
                  <input
                    placeholder={"Select Date"}
                    value=""
                    type={type}
                    onFocus={clickIn}
                    onBlur={clickOut}
                    onChange={handleDate}
                    className={`${
                      type == "text"
                        ? "w-auto md:w-[60%] "
                        : " w-[40%] md:w-[100%] text-black bg-slate-200"
                    } text-[3.5vw] md:text-sm m-0 date-element bg-transparent `}
                    id="date"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {type == "text" && (
                    <FontAwesomeIcon
                      onClick={clickIn}
                      onBlur={clickOut}
                      icon={faCaretDown}
                      className="md:ms-2 -ms-[2.5rem]"
                    />
                  )}
                </div>
                <div className="flex gap-2 md:block mt-2">
                  <h1 className="text-[4vw] m-0">{userDate?.split(" ")[0]}</h1>
                  <p className="text-[4vw] md:text-[1vw]">
                    {userDate
                      ?.split(" ")
                      .filter((x, index) => index != 0)
                      .join(" ")}
                  </p>
                </div>
              </div>
              <h1 className="w-full px-6 pt-6 py-3 mt-3 text-lg rounded-t-md block md:hidden bg-[#2F4858] text-white ">
                Nutrition
              </h1>
              <hr className="md:hidden" />
              <div className="w-full block md:hidden bg-[#2F4858] text-white px-6 py-8 rounded-b-md">
                <div className="flex justify-between mb-1">
                  <p className="text-lg italic">Calories</p>
                  <p className="text-lg ">{goals.calories}kcal</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).calories} total={goals.calories} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1 ">
                  <p className="text-lg italic">Protein</p>
                  <p className="text-lg">20g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).protein} total={goals.protein} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-lg italic">Carbs</p>
                  <p className="text-lg">80g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).carbs} total={goals.carbs} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-lg italic">Fats</p>
                  <p className="text-lg">2g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).fats} total={goals.fats} />
                <div style={{ height: "10px" }}></div>
              </div>

              <div className="mx-auto  border w-full md:w-[60%] hidden md:block content-container  md:col-start-2  md:row-start-1  md:row-span-3 bg-[#2F4858] text-white px-3 py-5 rounded-md">
                <h3 className="text-sm">Calories intake today</h3>
                <h1 className="text-[3.75vw] mb-3">
                  1580<span className="text-lg ms-1">kcal</span>
                </h1>
                <StatusBar animation={animation} curr={JSON.parse(sessionStorage.getItem('usernutrition')).calories} total={goals.calories} />
                <p className="float-end text-[1vw] mt-2">
                  {goals.calories}kcal
                </p>
              </div>
              <div className="mx-auto border px-6 py-6 w-full md:w-[90%] hidden md:block justify-content-center content-container md:col-start-3 md:row-start-2 bg-[#2F4858] text-white rounded-md">
                <div className="flex justify-between mb-1 ">
                  <p className="text-sm">Protein</p>
                  <p className="text-sm">20g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).protein} total={goals.protein} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Carbs</p>
                  <p className="text-sm">80g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).carbs} total={goals.carbs} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Fats</p>
                  <p className="text-sm">2g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={JSON.parse(sessionStorage.getItem('usernutrition')).fats} total={goals.fats} />
                <div style={{ height: "10px" }}></div>
              </div>
            </div>
            {/* <div className="absolute -left-[6%] md:-left-[3%] -top-[11%] md:-top-[5%]  w-[20%] md:w-[10%] ">
            <img src="/images/left-bg.png" alt="no image" width={"100%"} />
          </div>
          <div className="">
            <img
              src="/public/images/flat-healthy-food-background 1 (1).png"
              alt=""
              className=" w-[30vw] "
            />
          </div> */}
          {console.log(userMeals)}
         <div className="added-meals w-100 mt-[5rem] grid grid-cols-1 md:grid-cols-3 gap-x-[3rem]">
              <Diet setAnimation = {setAnimation} setaddFood = {setaddFood} setRefreshStatus={setRefreshStatus} setMealTime={setMealTime} userMeals={userMeals.breakfast??[]} head={"Breakfast"} />
              <Diet setAnimation = {setAnimation} setaddFood = {setaddFood} setRefreshStatus={setRefreshStatus} head={"Lunch"}  userMeals={userMeals.lunch??[]} setMealTime={setMealTime}/>
              <Diet setAnimation = {setAnimation} setaddFood = {setaddFood} setRefreshStatus={setRefreshStatus} head={"Dinner"}  userMeals={userMeals.dinner??[]} setMealTime={setMealTime} />
              <Diet setAnimation = {setAnimation} setaddFood = {setaddFood} setRefreshStatus={setRefreshStatus} head={"Snacks"}  userMeals={userMeals.snacks??[]} setMealTime={setMealTime} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="bg-[#736f67] w-100 blur-sm relative border-0"
            style={{ minHeight: `calc(100vh - ${headHeight}px)` }}
          ></div>
          <div
            className="bg-transparent flex justify-center items-center absolute bottom-0 w-[100%]  "
            style={{ minHeight: `calc(100vh - ${headHeight}px)` }}
          >
            <h1 className="text-black">
              Please Select Goals to view this page
            </h1>
          </div>
        </>
      )}

      {addFood && (
        <div className="fixed inset-0 h-full bg-black bg-opacity-50 flex flex-col items-center overflow-y-scroll">
 <div className="block md:flex w-[85vw]" style={{height:'fit-content'}} >
  {/* leftDiv */}
            <div className="mt-10 flex flex-col w-[85vw] md:w-auto flex-grow" style={{height:'fit-content'}} id="leftDiv">
                <div className="input flex w-full items-center">
                  <input
                    type="text"
                    className="w-full h-[35px] ps-5 py-[25px] rounded-lg focus:outline-none focus:shadow-lg focus:caret-[#d31608] focus:shadow-[#384438]"
                    value={inputValue}
                    onChange={handleChange}
                  />
                    <img
                    src="https://cdn-icons-png.flaticon.com/128/149/149852.png"
                    alt="search"
                    className="h-[21px] w-[21px]  -ms-10"
                  />
                </div>
                <div className="foodlist w-full mt-5 p-2 rounded-lg h-[65vh] bg-white overflow-y-scroll">
  {  inputValue.length ? (searchInnateList?.length?
              <>
                  { searchInnateList?.map((item,id)=>(
                    <div className="fitem border-b-[2px] py-2" onClick={()=>handleFoodClick(item)} key={id}>
                    
                        <p className="font-semibold ">{item.food_name}</p>
                        <div className="flex justify-between">
                          <div className="flex gap-x-4">
                            <p>Cal: <span>{item.calories}g</span></p>
                            <p>P: <span>{item.protein}g</span></p>
                            <p>C: <span>{item.carbs}g</span></p>
                            <p>F: <span>{item.fat}g</span></p>
                        </div>
                        <p className="me-5">{item.serving} {item.serveUnit}</p>
                        </div>
                  
                  </div>
                  ))}
              </>:<h3>No user foods found</h3>)
                :<h3 className="text-slate-500">Type on search to search foods</h3>}
                {isLoading && <div className="flex justify-center w-100"><img src="./images/spinning-dots.svg" alt="" className="w-[32px] m-0 p-0 -mb-3 me-3"/></div>}
                {searchlist?.length>0 && 
                <>
                  <div className="flex justify-between  ">
                    <h3 className="mt-4 text-slate-400 font-thin">USDA</h3>
                    

                  </div>
                <hr className="mb-3"/>
                
                {searchlist.map((item,id)=>(<div key={id}className="fitem border-b-[2px] py-2" onClick={()=>handleFoodClick(item)}>
                    <p className="font-semibold ">{item.description}</p>
                  <div className="flex justify-between">
                      <div className="flex gap-x-4">
                        {/* {
                        console.log(item.foodNutrients.filter(x=>x.nutrientId==1003)[0])} */}
                        <p>Cal: <span>{item.foodNutrients.find(x=>x.nutrientId==1008 || x.nutrientId==2047)?item.foodNutrients.filter(x=>x.nutrientId==1008||x.nutrientId==2047)[0].value:'--'} kcal</span></p>
                        <p>C: <span>{item.foodNutrients.find(x=>x.nutrientId==1005)?item.foodNutrients.filter(x=>x.nutrientId==1005)[0].value:'--'}g</span></p>
                        <p>P: <span>{item.foodNutrients.find(x=>x.nutrientId==1003)?item.foodNutrients.filter(x=>x.nutrientId==1003)[0].value:'--'}g</span></p>
                        <p>F: <span>{item.foodNutrients.find(x=>x.nutrientId==1004)?item.foodNutrients.filter(x=>x.nutrientId==1004)[0].value:'--'}g</span></p>
                      </div>
                      <p className="me-5 text-slate-600">{100} {
                    (item.servingSizeUnit=='GRM'?'g':(item.servingSizeUnit=='MLT'?'ml':item.servingSizeUnit))??'g'
                  
                    }</p>
                  </div>
                  </div>))}
                </>
                }
    
                </div>
            </div>
           {showFoodClick && 
           
          // rightDiv
             <div className="bg-white w-auto flex flex-col justify-between items-end md:ms-5 p-8 mt-10 rounded-lg overflow-y-scroll" style={{'height':`${rightDivHeight}px`}} id="rightDiv">
             {console.log(USDACurrentDetails)}
                  <div className="w-[100%]">
                      <h1 className="font-bold">{USDACurrentDetails.food_name}</h1>

                      <div className="flex items-center mt-2">
                    
                    <span className="w-[20%] me-3 text-sm">Serving:</span>
                    {console.log('measure',isMeasuresPresent)}
                    {Array.isArray(isMeasuresPresent)?
               
                    <>
                        <select name="add-recipe" id="" onChange={e=>handleInputCursorAndOptionChange(e)} className="w-[100%]">
                          {isMeasuresPresent.map((measures,index)=>(
                            <option key={index} value={`${measures.disseminationText} (${measures.gramWeight}g)`}
                            data-weight={measures.gramWeight}>
                              
                        {`${measures.disseminationText} (${measures.gramWeight}g)`}
    
                            </option>
    
                          ))}
                          <option value="Custom">Custom</option>
                      </select>
                    { console.log(USDACurrentDetails.serving == 'Custom')}                      
                      {USDACurrentDetails.serving =='Custom' && 
                       <>
                       <input
                         type="number"
                         placeholder="Serving"
                         className=" px-1 py-2 w-[80%] border border-slate-200 ps-3 rounded-md focus:bg-slate-300 text-sm"
                        //  ref={inputRef}
                        
                         onChange={e=>handleCustomInputValue(e)}
                       />
                       <select name="" id="" >
                       <option value={USDACurrentDetails.serveUnit} selected >{USDACurrentDetails.serveUnit}</option>
                       </select>
                     </>
                      }
                
                    </>
                  :
                    <>
                      <input
                        type="number"
                        placeholder="Serving"
                        className=" px-1 py-2 w-[80%] border border-pink-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                        value={USDACurrentDetails.serving}
                        onChange={handleSingleServingInput}
                      />
                      <select name="" id="" onChange={e=>setUSDACurrentDetails({...USDACurrentDetails,serveUnit:e.target.value})}>
                      <option value={USDACurrentDetails.serveUnit} selected >{USDACurrentDetails.serveUnit}</option>
                      </select>
                    </>}
            
                  </div>

                  <div className="flex  items-center mt-2 w-[100%] ">
                          
                          <span className="w-[20%] text-sm">Calories:</span>
                       
                            <input
                              type="number"
                              placeholder="Calories"
                              className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                              value={USDACurrentDetails.calories}  
                              disabled                          // onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                            />
                       
                        </div>

                        <div className="flex items-center mt-2 w-[100%]">
                          
                          <span className="w-[20%] text-sm">Carbs:</span>
                          <input
                            type="number"
                            placeholder="Carbs"
                            className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                            value={USDACurrentDetails.carbs}
                            disabled
                            // onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                          />
                        </div>


                        <div className="flex items-center mt-2">
                          
                          <span className="w-[20%] text-sm">Protein:</span>
                          <input
                            type="number"
                            placeholder="Protein"
                            className=" px-1 py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                            value={USDACurrentDetails.protein} 
                            disabled                           // onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                          />
                        </div>


                        <div className="flex items-center mt-2">
                          
                          <span className="w-[20%] text-sm">Fats:</span>
                          <input
                            type="number"
                            placeholder="Fats"
                            className=" px-1  py-2 w-[80%] border border-slate-100 ps-3 rounded-md focus:bg-slate-300 text-sm"
                            value={USDACurrentDetails.fat} 
                            disabled   
                            // onChange={(e)=>{setUserRecipeData({...userRecipeData,carbs:e.target.value})}}
                          />
                        </div>

                        <div className="flex items-center mt-2 ">
                          {console.log(previewImg)}
                      {/* { searchInnateList.filter(x=>x.foodimg==USDACurrentDetails.foodimg.startsWith()).length>0?  */}
                       {   !(USDACurrentDetails.foodimg instanceof File) && USDACurrentDetails.foodimg.startsWith(serverUrl) ? 
                            <img src={USDACurrentDetails.foodimg.split('-')[0]=='image'?`${serverUrl}/upload/${USDACurrentDetails.foodimg}`:USDACurrentDetails.foodimg} width='100%' alt="" id="fimage" style={{height:'150px'}}/>
                            // {console.log(`${serverUrl}/upload/${USDACurrentDetails.foodimg}`)}
                          : 
                          <label htmlFor="fimage">
                            <input type="file" name="" id="fimage" className="hidden border" onChange={handlePreviewImage}/>
                            <img src={previewImg?previewImg:USDACurrentDetails.foodimg} width='100%' alt="" id="fimage" style={{height:'150px'}}/>
                          </label>}
                        {/* <img src={foodimage} alt="" id="fimage" /> */}
                        </div>

                  </div>
        
                  <div className="flex mt-3">
      
                        <button className="px-4 py-2 rounded bg-slate-200 border border-black me-3 mb-3" onClick={handleAddMeal}>Add</button>
                        <button className="px-4 py-2 rounded bg-slate-200 border border-black me-3 mb-3" onClick={handleFoodClose}>Close</button>
        
                  </div>              
             </div>
           }
 </div>
 <div className="flex w-[85vw] justify-end mt-2">
  <div>
    <button className="bg-slate-200 px-4 py-2 rounded hover:bg-slate-400" onClick={handleAddmealClose}>Close</button>
  </div>
 </div>

        </div>
      )}
    <ToastContainer theme='dark' position="top-center" autoClose={2000} />
    </div>
  );
};

export default NutritionPage;
