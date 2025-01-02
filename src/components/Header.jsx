
import { useContext, useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Hamburger and close icons
import { Link } from 'react-router-dom';
import { addHeaderHeight, removeProfileDiv } from '../context/ContextShare';
import Profile from './Profile';

const Header = ({color}) => {
  const [isOpen, setIsOpen] = useState(false);
    const headRef = useRef(null)
    const [loginStatus,setLoginStatus] = useState(false)
    const {setHeadHeight} = useContext(addHeaderHeight)
    const {show,setShow,setShowgoal} = useContext(removeProfileDiv)

    // const {isGoalsDefined,setIsGoalsDefined} = useContext(isgoalsdefined)


  // const [headHeight,setHeadHeight] = useState(0)
  // console.log(headHeight);
  // console.log(color)
  // console.log(typeof logged)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if(show){

      setShow(false)
      setShowgoal(false)
    }
  };

 
  useEffect(()=>{
    function handleHeight(){setHeadHeight(headRef.current.offsetHeight)}

    handleHeight()

    window.addEventListener('resize',handleHeight)

    return ()=>window.removeEventListener('resize',handleHeight)
    
  },[])

  useEffect(()=>{
    if(sessionStorage.getItem('token')){
      setLoginStatus(true)
    }
    else{
      setLoginStatus(false)
    }
  },[loginStatus])


  return (
    <div className="h-auto z-10" style={{backgroundColor:color||"#C7BFCC" }} ref={headRef} >
      <div className="flex justify-between items-center pb-4 px-4 pt-1">
        <div className="">
          <img
            src="/images/cover-removebg-preview (1) 1.png"
            alt="logo"
            className="w-100 -my-5"
          />
        </div>
        <div className="hidden md:flex gap-x-4">
          <Link to="/" className='hover-link relative hover:scale-[1.1]'><p>Home</p></Link>
          <Link to="/food-database" className='hover-link relative hover:scale-[1.1]'><p>Add recipes</p></Link>
          <Link to="/dashboard" className='hover-link relative hover:scale-[1.1]'><p>Nutritional info</p></Link>
        </div>
     { loginStatus ? <Profile setLoginStatus = {setLoginStatus} />:<div className="hidden md:flex gap-x-4 mx-4">
          <button className="bg-black text-white px-4 py-2 rounded-lg"><Link to={"/register"}>Sign Up</Link></button>
          <button className="bg-white text-black px-4 py-2 rounded-lg border border-black"><Link to={"/login"}>Sign In</Link></button>
        </div>}
        <div className=" md:hidden">
          <button onClick={toggleMenu}>
             <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed z-10 top-0 right-0 w-2/3 h-full bg-white p-8 flex flex-col items-start gap-y-6 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className='w-full flex justify-end'>
          <button onClick={toggleMenu}>
               <FaTimes size={24} />
            </button>
        </div>
        <Link to="/" ><p>Home</p></Link>
          <Link to="/food-database"><p>Add recipes</p></Link>
          <Link to="/dashboard"><p>Nutritional info</p></Link>
      
        {loginStatus ? "":<div className="flex flex-col gap-y-4 mt-4">
          <button className="bg-black text-white px-4 py-2 rounded-lg"><Link to={"/register"}>Sign Up</Link></button>
          <button className="bg-white text-black px-4 py-2 rounded-lg border border-black"><Link to={"/login"}>Sign In</Link></button>
        </div>}
      </div>
      {/* {console.log(headHeight)} */}
    </div>
  );
};

export default Header;
