  import { useContext, useEffect,  useState } from "react";
import Header from "../components/Header";
import StatusBar from "../components/StatusBar";


import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import Diet from "../components/Diet";
import { addHeaderHeight, removeProfileDiv } from "../context/ContextShare";
import { useNavigate } from "react-router-dom";
import { AddSearchCacheFoodsApi, AddUSDAEditedImageApi, ChangeAfterUpdatedQuantityAPI, EditUserMealApi, FindUSDAFoodApi, GetSearchFoodsinAddrecipesApi, GetUserMealsOfTheDayApi, PaymentsAPI } from "../services/allApis";
import axios from "axios";
import { serverUrl } from "../services/serverUrl";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PremiumNutrition from "../components/PremiumNutrition";

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
  const [isQuantityUpdated,setIsQuantityUpdated] = useState(false)
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
    foodimg:'',
    vitaminC:'',
    vitaminD:'',
    iron:''
  })

  const [isMeasuresPresent,setIsMeasuresPresent] = useState(null)

  const [refreshStatus,setRefreshStatus] = useState({})
  const [mealTime,setMealTime] = useState('')

  const [quantityChangedValues,setQuantityChangedValues] = useState({})

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
  let foodMeasureServing = false
  let foodMeasureWeight = 0
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

    if(serving.split('-')[1]=='foodMeasure'){
      foodMeasureServing = true

      const startIndex = serving.lastIndexOf('(')
      const endIndex = serving.lastIndexOf(')')
      const res = serving.slice(startIndex+1,endIndex-1)
      const regex = /\d+/;
      const result = res.match(regex);
      foodMeasureWeight = result[0]
      // serving = serving.split('-')[0]
    }


    setUSDACurrentDetails({...USDACurrentDetails,serving:serving,calories:newCalories,carbs:newCarbs,fat:newFats,protein:newProtein,customServing:serving=='Custom'?weight:(foodMeasureServing?foodMeasureWeight:'')})
    // console.log(USDACurrentDetails)
}

const firstCalculate = (details,weight) =>{
  console.log("Weight",weight)
  let newCalories = ''
  let newCarbs = ''
  let newFats = ''
  let newProtein = ''
  let newvitaminC = ''
  let newvitaminD = ''
  let newiron = ''
  console.log(details)
  console.log(details.vitaminC)
    if(weight && !(details.serveUnit=='serving') )
    { newCalories = ((details.calories*weight)/100).toFixed(2)
     newCarbs = ((details.carbs*weight)/100).toFixed(2)
     newFats = ((details.fat*weight)/100).toFixed(2)
     newProtein = ((details.protein*weight)/100).toFixed(2)
     newvitaminC = ((details.vitaminC*weight)/100).toFixed(2)
     newvitaminD = ((details.vitaminD*weight*40)/100).toFixed(2)
     newiron = ((details.iron*weight)/100).toFixed(2)}
    
    if(details.serveUnit=='serving'){
      newCalories = details.calories*weight
     newCarbs = details.carbs*weight
     newFats = details.fat*weight
     newProtein = details.protein*weight
     newvitaminC = details.vitaminC*weight
     newvitaminD = details.vitaminD*weight
     newiron = details.iron*weight
    }
    console.log("New cal",newCalories)

    setUSDACurrentDetails({food_id:details.food_id,food_name:details.food_name,serving:details.serving+'-foodMeasure',customServing:weight,serveUnit:details.serveUnit,calories:newCalories,carbs:newCarbs,fat:newFats,protein:newProtein,foodimg:details.foodimg,vitaminC:newvitaminC,vitaminD:newvitaminD,iron:newiron})
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
    console.log(item)
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
      
      calories: item.calories == 0 ? 0: item.calories ?? (item.foodNutrients.find(x=>x.nutrientId==1008 || x.nutrientId==2047)?item.foodNutrients.filter(x=>x.nutrientId==1008||x.nutrientId==2047)[0].value:'--'),
      
      protein: item.protein == 0 ? 0 :item.protein  ??(item.foodNutrients.find(x=>x.nutrientId==1003)?item.foodNutrients.filter(x=>x.nutrientId==1003)[0].value:'--'),
      
      fat: item.fat == 0 ? 0: item.fat ?? (item.foodNutrients.find(x=>x.nutrientId==1004)?item.foodNutrients.filter(x=>x.nutrientId==1004)[0].value:'--'),
      
      carbs: item.carbs == 0? 0: item.carbs ?? (item.foodNutrients.find(x=>x.nutrientId==1005)?item.foodNutrients.filter(x=>x.nutrientId==1005)[0].value:'--'),
      
      customServing:'',
      
      foodimg:item.foodimg?`${serverUrl}/upload/${item.foodimg}`:(check!== -1?`${serverUrl}/upload/${isChangedImage[check].foodimg}` :await fetchPexelsData(item.description)),

      vitaminC:(item.vitaminC == 0 )? 0: item.vitaminC ?? (item.foodNutrients && item.foodNutrients.find(x=>x.nutrientId==1162)?item.foodNutrients.filter(x=>x.nutrientId==1162)[0].value:0),//1162 unitName mg

      vitaminD:(item.vitaminD == 0 )? 0: item.vitaminD ?? (item.foodNutrients && item.foodNutrients.find(x=>x.nutrientId==1114)?item.foodNutrients.filter(x=>x.nutrientId==1114)[0].value:0),//1114 mcg

      iron:(item.iron == 0)? 0: item.iron ?? (item.foodNutrients && item.foodNutrients.find(x=>x.nutrientId==1089)?item.foodNutrients.filter(x=>x.nutrientId==1089)[0].value:0)//1089 unitName mg
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
      const token = sessionStorage.getItem('token')
      const reqHeader = {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`}
    const pro1 = await GetSearchFoodsinAddrecipesApi(val,reqHeader)
    console.log(pro1.data)
    setSearchInnateList(pro1.data)
    const data = JSON.parse(sessionStorage.getItem('existingUser')).searchedfoods
    console.log(data)
    if(!data || !data[val]){
    // const dataTypes = ['Branded', 'SR Legacy', 'Survey (FNDDS)', 'Foundation'];
    // const res = await Promise.all(dataTypes.map(type=>FindUSDAFoodApi(type,inputValue))) 
      console.log('Inside new Api call')
    let Branded =[]
    let Foundation = []
    let SRLegacy = []
    let Survey = []
    console.log("Input",inputValue)
    const apidata = await FindUSDAFoodApi('Foundation',inputValue.trim());
   (apidata.data.foods.length)>0 && Foundation.push(...apidata.data.foods)
   console.log(Foundation)
   console.log(apidata)

   if(apidata.data.aggregations.dataType.hasOwnProperty('SR Legacy')){
    console.log('Inside SR Legacy')
      const res1 = await FindUSDAFoodApi('SR Legacy',inputValue.trim())
    console.log(res1.data);
    (res1.data.foods.length)>0 && SRLegacy.push(...res1.data.foods)
   }
   if(apidata.data.aggregations.dataType.hasOwnProperty('Survey (FNDDS)')){
    console.log('Inside Survey (FNDDS)')
      const res2 = await FindUSDAFoodApi('Survey (FNDDS)',inputValue.trim())
    console.log(res2.data);
   (res2.data.foods.length)>0 && Survey.push(...res2.data.foods)
   }
   if(apidata.data.aggregations.dataType.hasOwnProperty('Branded')){
    console.log('Inside Branded')
      const res3 = await FindUSDAFoodApi('Branded',inputValue.trim())
    console.log(res3.data);
    (res3.data.foods.length)>0 && Survey.push(...res3.data.foods)
   }
    // 1.foundation
    // 2.SR legacy
    // 3.Survey (FNDDS)
    // 4. branded

    console.log(Branded,Survey,Foundation,SRLegacy)

  Branded = Branded.length>10?Branded
    
    .filter(x => 
        { 
          const words = x.description.match(new RegExp(inputValue,'i')); 
          const arr = inputValue.trim().split(" ")
          
          if(arr.length>1){
            for(let item of arr){
            if(x.description.match(new RegExp(item,'i'))){
              return true
            }
          }}
          // const upperVal = inputValue.toUpperCase(); 
          // const capitalizedVal = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); 
          return words
          // || words.includes(inputValue) 
          // || words.includes(capitalizedVal)
        })
          .sort((a,b)=> a.description.length - b.description.length )
          .slice(0,4)
          :Branded;
    // const Brand1 = res[0].data.foods.length>10?res[0].data.foods.slice(0,10):res[0].data.foods;
     SRLegacy = SRLegacy.length>5?SRLegacy
    .filter(x => 
      { 
        const words = x.description.match(new RegExp(inputValue,'i')); 
        const arr = inputValue.split(" ")
        if(arr.length>1){
          for(let item of arr){
          if(x.description.match(new RegExp(item,'i'))){
            return true
          }
        }}
        // const capitalizedVal = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); 
        return words
        // || words.includes(inputValue) 
        // || words.includes(capitalizedVal)
      })
    // .sort((a,b)=> a.description.length - b.description.length )
    .slice(0,6)
    :SRLegacy;
     Survey = Survey.length>3?Survey
    .filter(x => 
      { 
        const words = x.description.match(new RegExp(inputValue,'i')); 
        const arr = inputValue.split(" ")
        if(arr.length>1){
          for(let item of arr){
          if(x.description.match(new RegExp(item,'i'))){
            return true
          }
        }}
        // const upperVal = inputValue.toUpperCase(); 
        // const capitalizedVal = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); 
        return words
        // || words.includes(inputValue) 
        // || words.includes(capitalizedVal)
      })
      // .sort((a,b)=> a.description.length - b.description.length )
      .slice(0,3)
    :Survey;
     Foundation = Foundation.length>10?Foundation
    .filter(x => 
      { 
        const words = x.description.match(new RegExp(inputValue,'i')); 
        const arr = inputValue.split(" ")
        if(arr.length>1){
          for(let item of arr){
          if(x.description.match(new RegExp(item,'i'))){
            return true
          }
        }}
        // const upperVal = inputValue.toUpperCase(); 
        // const capitalizedVal = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); 
        return words
        // || words.includes(inputValue) 
        // || words.includes(capitalizedVal)
      })
        .sort((a,b)=> a.description.length - b.description.length )
        .slice(0,10)
    :Foundation
    

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
    //     const upperVal = inputValue.toUpperCase(); 
    //     const capitalizedVal = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); 
    //     return words|| words.includes(inputValue) || words.includes(capitalizedVal)})
    // .filter(x=>x.description.split(" ").includes(`${inputValue.toUpperCase()}`))
    // 

    // console.log(res1)
    setSearchlist(arr)
   
    if(sessionStorage.getItem('token') && arr.length>0){
      const token = sessionStorage.getItem('token')
      const reqHeader = {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`}
    const result = await AddSearchCacheFoodsApi({search:inputValue,data:arr},reqHeader)
    console.log(result.data)
    if(result.status==200){
      sessionStorage.setItem('existingUser',JSON.stringify(result.data.existingUser))
    }
    
  }

  }
  else{
    console.log('Inside existing search')
    const res = data[val].filter(x=>{
      const nutrientIdsToExclude = [1003, 1004, 1005];
      const nutrientIdsToInclude = [1008, 2047];
    
      const hasExcludedNutrients = nutrientIdsToExclude.some(id => 
        x.foodNutrients.some(nutrient => nutrient.nutrientId === id)
      );
    
      const hasIncludedNutrients = nutrientIdsToInclude.some(id => 
        x.foodNutrients.some(nutrient => nutrient.nutrientId === id)
      );
    
      return hasExcludedNutrients && hasIncludedNutrients;
      
    })
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
// const[datasetMeasure,setDatasetMeasure] = useState(null)


  const handleInputCursorAndOptionChange = (e) =>{
    const selectedVal = e.target.value!=='Custom'?e.target.value + '-foodMeasure':'Custom'
    console.log(selectedVal)
      const selectedWeight = e.target.selectedOptions[0].dataset.weight;
      // setDatasetMeasure(selectedWeight)
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

const [currentNutrition,setCurrentNutrition] = useState({})




useEffect(()=>{
  setAnimation(false)
  firstTimeUserMeals()
 
},[userDate])



const handleButtonSaveChanges = async() =>{
  console.log('Api call')
  setAnimation(false)
  const reqbody = {...quantityChangedValues}
  console.log(reqbody)
  const token= sessionStorage.getItem('token')
  const reqHeader = {
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`}

  const res = await ChangeAfterUpdatedQuantityAPI(reqbody,reqHeader)
  console.log(res.data)
  if(res.status==200){
    sessionStorage.setItem('UsermealsToday',JSON.stringify(res.data))
    setIsQuantityUpdated(false)
    setQuantityChangedValues({})
    setRefreshStatus(res.data)
    // setUnsavedNutrition({})
  }
  setAnimation(true)
  
}

console.log('frontend stripe',import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const buyFunction = async() =>{
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const body = {
        products:'Nutri Premium'
    }
    const token = sessionStorage.getItem('token')
    const headers = {
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`}

    const response = await PaymentsAPI(body,headers)


    // const session = await response.json();

    console.log(response)

    const result = await stripe.redirectToCheckout({
        sessionId:response.data.id
    });
    
    if(result.error){
        console.log(result.error);
    }
    
    // const urlParams = new URLSearchParams(window.location.search);
    // const sessionId = urlParams.get('session_id');
    // console.log(sessionId)
    
    // if (sessionId) {
    // stripe.checkout.sessions.retrieve(sessionId).then(session => {
    //     console.log("Client-side: Retrieved Session:", session);
    //     if (session.payment_status === 'paid') {
    //         //Update UI to show success
    //         console.log('Paid')
    //     }
    //   }).catch(error => {
    //     console.error("Client-side: Error retrieving session:", error);
    //   });
    // }
  }
const [isPremium,setIsPremium] = useState(false)
const getPaidStatus = ()=>{
  if(JSON.parse(sessionStorage.getItem('existingUser')).payment_status == 'paid'){
    console.log('User has paid')
    setIsPremium(true)
  }
  else{
    console.log('User NOT PAID')
  }
}
  // const data = await result.json()
  // console.log(data)
  // useEffect(()=>{
  //   return()=>{
  //     if(isQuantityUpdated)
  //     handleButtonSaveChanges()
  //     alert('Saved changes')
  //   }
  // },[])

  const handleAddMeal = async() =>{
    setAnimation(false)

    let {food_id,food_name,serving,serveUnit,calories,carbs,protein,fat,foodimg,customServing,vitaminC,vitaminD,iron} = USDACurrentDetails
    let quantity = 1 // for all cases except for user meals or serving meals
    console.log('Servings',serving)
          if((serving =='Custom'&& !customServing) || (serving!='Custom' && !serving)){
            alert("Please Enter the serving")
          }
          else{
            if(customServing){
               carbs = ((USDACurrentDetails.carbs/customServing)*100).toFixed(2)
               fat = ((USDACurrentDetails.fat/customServing)*100).toFixed(2)
               protein = ((USDACurrentDetails.protein/customServing)*100).toFixed(2)
               calories = ((USDACurrentDetails.calories/customServing)*100).toFixed(2)
               vitaminC = ((USDACurrentDetails.vitaminC/customServing)*100).toFixed(2)
               vitaminD = ((USDACurrentDetails.vitaminD/customServing)*100).toFixed(2)
               iron = ((USDACurrentDetails.iron/customServing)*100).toFixed(2)

               
        
            }
           
            else if(serveUnit=='serving'){
              carbs = (USDACurrentDetails.carbs/serving).toFixed(2)
              fat = (USDACurrentDetails.fat/serving).toFixed(2)
              protein = (USDACurrentDetails.protein/serving).toFixed(2)
              calories = (USDACurrentDetails.calories/serving).toFixed(2)
              vitaminC = (USDACurrentDetails.vitaminC/serving).toFixed(2)
              vitaminD = (USDACurrentDetails.vitaminD/serving).toFixed(2) 
              iron = (USDACurrentDetails.iron/serving).toFixed(2) 
              quantity = serving
              serving=1
            }
            else if(serving && serveUnit!=='serving'){
              carbs = ((USDACurrentDetails.carbs/serving)*100).toFixed(2)
              fat = ((USDACurrentDetails.fat/serving)*100).toFixed(2)
              protein = ((USDACurrentDetails.protein/serving)*100).toFixed(2)
              calories = ((USDACurrentDetails.calories/serving)*100).toFixed(2)
              vitaminC = ((USDACurrentDetails.vitaminC/serving)*100).toFixed(2)
              vitaminD = ((USDACurrentDetails.vitaminD/serving)*100).toFixed(2)
              iron = ((USDACurrentDetails.iron/serving)*100).toFixed(2)
            }
            else{
              alert('Couldnot calculate values')
            }
            console.log('Calories sent',calories)

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
          reqBody.append('vitaminC',vitaminC)
          reqBody.append('vitaminD',vitaminD)
          reqBody.append('iron',iron)
          reqBody.append('quantity',quantity)

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

  const ConditionNutrientCalculator = (index,item,nutrient)=>{
    let tempNutrition = item[nutrient]
    if(item.customServing){
        tempNutrition = (tempNutrition*item.customServing)/100
    }
    else if(item.serveUnit=='serving'){
        tempNutrition = tempNutrition*item.serving
    }
    else{
        tempNutrition = (tempNutrition*item.serving)/100
    }

    if(Object.keys(quantityChangedValues).length>0){
        tempNutrition = (tempNutrition)*(quantityChangedValues[item.mealtime][index].quantity*1)
        return tempNutrition
    }
    return tempNutrition*item.quantity
  }


// runs every time when refreshed and as well as when change is introduced
  const getCurrentGoalValues = () =>{
    
      let calories = 0;
    let protein = 0;
    let fats = 0;
      let carbs = 0;
      let vitaminC=0
      let vitaminD=0
      let iron=0
      const data = sessionStorage.getItem('UsermealsToday')
      const searchList = data?(Object.keys(quantityChangedValues).length>0?quantityChangedValues:JSON.parse(data)):{}
      console.log(searchList,JSON.parse(data))

    if(Object.keys(searchList).length>0)
    {  
      for(let x in searchList){
      if(x=='breakfast'|| x=='lunch'||x=='dinner'|| x=='snacks'){
        if(searchList[x].length>0){
          searchList[x].forEach((item,index)=>{
            console.log('Hello')
            calories+=(ConditionNutrientCalculator(index,item,'calories')*1)
            protein+=(ConditionNutrientCalculator(index,item,'protein')*1)
            fats+=(ConditionNutrientCalculator(index,item,'fat')*1)
            carbs+=(ConditionNutrientCalculator(index,item,'carbs')*1)

            if(item.vitaminC!=undefined && item.vitaminD!=undefined && item.iron!=undefined){
              vitaminC+=(ConditionNutrientCalculator(index,item,'vitaminC')*1)
              vitaminD+=(ConditionNutrientCalculator(index,item,'vitaminD')*1)
              iron+=(ConditionNutrientCalculator(index,item,'iron')*1)
            }

          }
            )

        }
      }
      }
    }
    let objdata = {calories:calories.toFixed(2)*1,protein:protein.toFixed(2)*1,fats:fats.toFixed(2)*1,carbs:carbs.toFixed(2)*1,vitaminC:vitaminC.toFixed(2),vitaminD:vitaminD.toFixed(2),iron:iron.toFixed(2)};
    setCurrentNutrition(objdata)
    console.log('ObjData',objdata)
    console.log(calories,protein,fats,carbs,"VitaminC",vitaminC,vitaminD,iron)


  }


const [userMeals,setUserMeals] = useState({})
useEffect(()=>(
  getCurrentGoalValues()
),[quantityChangedValues,refreshStatus])

//main useEffect
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      console.log("Inside Nutrition page");
      getGoals();
      
      getChangedImages();
      adjustRightDivHeight();
      getPaidStatus();
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
              {/* <button onClick={handleRiceSearch}>Click me</button> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] grid-rows-1 md:grid-rows-[1vw_auto_1vw] w-100 mt-8">
              <div className="w-full md:w-[60%] date-container mx-auto md:col-start-1 md:row-start-2 bg-[#2F4858] text-white px-3 py-3 rounded-md">
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
                    < FontAwesomeIcon
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
                  <p className="text-lg ">{currentNutrition.calories} kcal</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.calories} total={goals.calories} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1 ">
                  <p className="text-lg italic">Protein</p>
                  <p className="text-lg">{currentNutrition.protein} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.protein} total={goals.protein} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-lg italic">Carbs</p>
                  <p className="text-lg">{currentNutrition.carbs} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.carbs} total={goals.carbs} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-lg italic">Fats</p>
                  <p className="text-lg">{currentNutrition.fats} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.fats} total={goals.fats} />
                <div style={{ height: "10px" }}></div>
              </div>

              <div className="mx-auto  border w-full md:w-[60%] hidden md:block content-container  md:col-start-2  md:row-start-1  md:row-span-3 bg-[#2F4858] text-white px-3 py-5 rounded-md">
                <h3 className="text-sm">Calories intake today</h3>
                <h1 className="text-[3.75vw] mb-6">
                {currentNutrition.calories}<span className="text-lg ms-1">kcal</span>
                </h1>
                <StatusBar animation={animation} curr={currentNutrition.calories} total={goals.calories} />
                <p className="float-end text-[1.1vw] mt-2">
                Goal: {goals.calories}kcal
                </p>
              </div>
              <div className="mx-auto border px-6 py-6 w-full md:w-[90%] hidden md:block justify-content-center content-container md:col-start-3 md:row-start-2 bg-[#2F4858] text-white rounded-md">
                <div className="flex justify-between mb-1 ">
                  <p className="text-sm">Protein</p>
                  <p className="text-sm">{currentNutrition.protein} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.protein} total={goals.protein} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Carbs</p>
                  <p className="text-sm">{currentNutrition.carbs} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.carbs} total={goals.carbs} />
                <div style={{ height: "10px" }}></div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Fats</p>
                  <p className="text-sm">{currentNutrition.fats} g</p>
                </div>
                <StatusBar animation={animation} small={true} curr={currentNutrition.fats} total={goals.fats} />
                <div style={{ height: "10px" }}></div>
              </div>
            </div>

            {isQuantityUpdated && <div className="flex justify-center mt-7  -mb-5  ">
                  <div className="rounded py-1 px-2 bg-[#2F4858] border border-2 border-black flex items-center gap-2">
                    <h2 className="bg-[#2F4858] text-white">Updates detected</h2>
                      <button className="btn rounded bg-[#EE973F] p-1" onClick={handleButtonSaveChanges}>Save changes</button>
                  </div>
            </div>}
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
         
         <div className="added-meals w-100 mt-[5rem] grid grid-cols-1 md:grid-cols-3 gap-x-[3rem]">
              <Diet 
              mealTime = {mealTime} 
              isQuantityUpdated={isQuantityUpdated} 
              quantityChangedValues={quantityChangedValues} 
              setQuantityChangedValues = {setQuantityChangedValues}
              setIsQuantityUpdated={setIsQuantityUpdated}
              setAnimation = {setAnimation}
              setaddFood = {setaddFood}
              setRefreshStatus={setRefreshStatus}
              setMealTime={setMealTime}
              userMeals={userMeals.breakfast??[]}
              head={"Breakfast"}
              ConditionNutrientCalculator={ConditionNutrientCalculator}/>
              <Diet 
               mealTime = {mealTime}
               isQuantityUpdated={isQuantityUpdated} 
               quantityChangedValues={quantityChangedValues}
               setQuantityChangedValues = {setQuantityChangedValues}
               setIsQuantityUpdated={setIsQuantityUpdated}
               setAnimation = {setAnimation}
               setaddFood = {setaddFood}
               setRefreshStatus={setRefreshStatus}
               head={"Lunch"}
                userMeals={userMeals.lunch??[]}
               setMealTime={setMealTime}
              ConditionNutrientCalculator={ConditionNutrientCalculator}
              />
              <Diet mealTime = {mealTime}
               isQuantityUpdated={isQuantityUpdated} 
               quantityChangedValues={quantityChangedValues}
               setQuantityChangedValues = {setQuantityChangedValues}
               setIsQuantityUpdated={setIsQuantityUpdated}
               setAnimation = {setAnimation}
               setaddFood = {setaddFood}
               setRefreshStatus={setRefreshStatus}
               head={"Dinner"}
               userMeals={userMeals.dinner??[]}
               setMealTime={setMealTime}
               ConditionNutrientCalculator={ConditionNutrientCalculator}
               />
              <Diet mealTime = {mealTime}
               isQuantityUpdated={isQuantityUpdated} 
               quantityChangedValues={quantityChangedValues}
               setQuantityChangedValues = {setQuantityChangedValues}
               setIsQuantityUpdated={setIsQuantityUpdated}
               setAnimation = {setAnimation}
               setaddFood = {setaddFood}
               setRefreshStatus={setRefreshStatus}
               head={"Snacks"}
               userMeals={userMeals.snacks??[]}
               setMealTime={setMealTime}
               ConditionNutrientCalculator={ConditionNutrientCalculator}
               />
            </div>
{ !isPremium ? <div className=" flex justify-center mb-20">
          <button onClick={buyFunction} className="bg-[#ffb643] px-3 py-2 rounded shadow-lg border-[#616161]"><FontAwesomeIcon icon={faCrown} style={{color: "#fbf7f1"}} className="me-3 scale-125" />Get Detailed Nutrition Summary</button>
          </div>:
        <PremiumNutrition currentNutrition={currentNutrition} animation={animation} setAnimation={setAnimation}/>}
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
