
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import NutritionPage from './pages/NutritionPage'
import AddRecipesPage from './pages/AddRecipesPage'
import PageNotFound from './pages/PageNotFound'
import Goals from './pages/Goals'

function App() {


  return (
    <>
    
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<LoginPage />}/>
      <Route path='/login' element={<LoginPage login={true}/>}/>
      <Route path='/dashboard' element={<NutritionPage/>}/>
      <Route path='/food-database' element={<AddRecipesPage/>}/>
      <Route path = '/goals' element={<Goals/>}/>
      <Route path = '/edit-goals' element={<Goals edit={true}/>}/>
      <Route path='*' element={<PageNotFound/>}/>
     </Routes>
    </>
  )
}

export default App
