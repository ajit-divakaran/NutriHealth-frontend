import React from 'react'
import StatusBar from './StatusBar'

const NutriData = () => {
  return (
   <>
        <div className="mx-auto  border w-full md:w-[60%] hidden md:block content-container  md:col-start-2  md:row-start-1  md:row-span-3 bg-[#2F4858] text-white px-3 py-5 rounded-md">
        <h3 className="text-sm">Calories intake today</h3>
        <h1 className="text-[3.75vw] mb-3">
          1580<span className="text-lg ms-1">kcal</span>
        </h1>
        <StatusBar />
        <p className="float-end text-[1vw] mt-2">2000kcal</p>
      </div>
      <div className="mx-auto border px-6 py-6 w-full md:w-[90%] hidden md:block justify-content-center content-container md:col-start-3 md:row-start-2 bg-[#2F4858] text-white rounded-md">
        <div className="flex justify-between mb-1 ">
          <p className="text-sm">Protein</p>
          <p className="text-sm">20g</p>
        </div>
        <StatusBar small = {true} /><div style={{height:'10px'}}></div>
        <div className="flex justify-between mb-1">
          <p className="text-sm">Carbs</p>
          <p className="text-sm">80g</p>
        </div>
        <StatusBar small = {true}  /><div style={{height:'10px'}}></div>
        <div className="flex justify-between mb-1">
          <p className="text-sm">Fats</p>
          <p className="text-sm">2g</p>
        </div>
        <StatusBar small = {true}  /><div style={{height:'10px'}}></div>
      </div>
   </>
  )
}

export default NutriData