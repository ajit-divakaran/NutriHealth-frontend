import React, { useEffect, useState } from 'react'
import { serverUrl } from '../services/serverUrl';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentsAPI } from '../services/allApis';


const SuccessPaymentPage = () => {
    const [amountIsPaid, setAmountIsPaid] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    const buyFunction = async() =>{
      const stripe = await loadStripe("pk_test_51QjegEF5juGM9lQ5w6Y5beFOaRWRY6FZhuNhbTe4Tzs4CWUkI2MS6VsamfuzFrkH5Hf7qPuPGkmbprmVoIHPv7xe00OPqp8kvF");
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
        
      }
  
    useEffect(() => {
      const fetchSession = async () => {
        try {
          if (sessionId) {
            const token = sessionStorage.getItem('token')
            const response = await fetch(`${serverUrl}/retrieve-session`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',"Authorization":`Bearer ${token}` },
              body: JSON.stringify({ sessionId }),
            });
            console.log(response)
  
            if (!response.ok) {
              throw new Error('Failed to fetch session');
            }
  
            const session = await response.json();
            console.log("Client-side: Retrieved Session:", session);
  
            if (session.payment_status === 'paid') {
              setAmountIsPaid(true);
              const obj = JSON.parse(sessionStorage.getItem('existingUser'))
              obj.payment_status = 'paid'
              console.log(obj)
              sessionStorage.setItem('existingUser',JSON.stringify(obj))
              console.log('Paid');
            } else if (session.payment_status === 'unpaid') {
              setAmountIsPaid(false);
              console.log('Unpaid');
            } else if (session.payment_status === 'no_payment_required') {
              setAmountIsPaid(true);
              console.log('No payment required');
            }
          } else {
            console.error("Session ID is missing");
            setAmountIsPaid(false);
          }
        } catch (error) {
          console.error("Client-side: Error retrieving session:", error);
          setAmountIsPaid(false);
        }
      };
  
      fetchSession();
    }, [sessionId]);


   if (amountIsPaid === null) {
          return (<div className='flex justify-center  bg-black h-[100vh]'>
          <div className='flex flex-col items-center h-[75vh]'>
            <img src="/images/Circle Loader.gif" alt="Hello image" className=' h-[80%] ' />
       

            <h2 className="text-white res-font text-center " style={{'--bs-font':'1rem'}}>Payment processing ...</h2>
          </div>

        </div>
        );
        } else if (amountIsPaid) {
          return( <div className='flex justify-center  bg-black h-[100vh]'>
            <div className='flex flex-col items-center h-[75vh]'>
              <img src="/images/ezgif.com-animated-gif-maker.gif" alt="Hello image" className=' h-[80%] ' />
              <h2 className="text-white res-font text-center -mt-[4rem]">Successful payment</h2>
              <Link to='/dashboard'><button className='btn rounded bg-slate-100 p-3 mt-4'>Back to Dashboard</button></Link>
            </div>

          </div>);
        } 
        else {
                    return( <div className='flex justify-center  bg-black h-[100vh]'>
            <div className='flex flex-col items-center h-[75vh]'>
                  

            <DotLottieReact
      src="https://lottie.host/e08d7eb9-dee6-47a7-a1a5-7ade29eb3a2c/kunvVqA9ZI.lottie"
      autoplay
    />
    <button className='btn rounded bg-slate-100 p-3 mt-8' onClick={buyFunction}>Retry payment</button>
            
            </div>

          </div>)
        }
    
    
    }

  


export default SuccessPaymentPage