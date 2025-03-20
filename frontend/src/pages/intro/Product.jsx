import { Button } from "antd";
import React from "react";


function Product() {
    return (
        <div className="flex flex-col gap-5 max-w-[1860px] min-w-[850px]">    
          <span className='text-2xl font-semibold text-red-500'>Ảnh</span>
            <div className='flex gap-5 justify-between'>
              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
                <Button>Caption</Button>
              </div>

              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
              <Button>Caption</Button>
              </div>  

              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
                <Button>Caption</Button>
              </div>
            </div>

            <div className='flex gap-5 justify-between'>
              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
                <Button>Caption</Button>
              </div>

              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
              <Button>Caption</Button>
              </div>  
                        
              <div className="flex flex-col items-center w-1/3 gap-2.5">
                <img src="/image.png" className="rounded-2xl"/>
                <Button>Caption</Button>
              </div>
            </div>
          <span className='text-2xl font-semibold text-red-500'>Video</span>
        </div>
      );
}

export default Product;
