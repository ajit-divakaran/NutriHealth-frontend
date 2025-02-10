import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadStripe } from '@stripe/stripe-js'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ExpireSessionAPI } from '../services/allApis'

const CancelPaymentPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  console.log(sessionId)
  useEffect(()=>{
    const expireFunc = async()=>{
      const reqheader = {
        "Content-Type":"application/json",
       }
      const response = await ExpireSessionAPI({sessionId:sessionId},reqheader)
      console.log(response.data)
    }
    expireFunc()
  },[sessionId])
  return (
    <div className='bg-slate-900 h-[100vh] flex justify-center pt-[5rem]'>
<div className=''>
        <h1 className='text-white'>Oops! Something went wrong</h1>
        <Link to='/dashboard'><button className='text-black mt-4 px-3 py-2 rounded bg-[#edbbbf]'><FontAwesomeIcon icon={faArrowLeft} className=' me-2'/>Back to Dashboard</button></Link>
  
</div>    </div>
  )
}

export default CancelPaymentPage