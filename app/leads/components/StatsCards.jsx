"use client";

import { Users } from "lucide-react";

export default function Statistics(){

  const stats=[
    {title:"Attempted",percent:"13%",color:"text-blue-500"},
    {title:"Contacted",percent:"21%",color:"text-yellow-500"},
    {title:"Converted",percent:"2%",color:"text-green-500"},
    {title:"Cancelled",percent:"1%",color:"text-red-500"}
  ];

  return(

    <div className="bg-white shadow-sm p-6">

      <h3 className="font-semibold mb-4">
        Statistics
      </h3>

      <div className="grid grid-cols-4 gap-6">

        {stats.map((s,i)=>(
          <div key={i} className="flex items-center gap-3">

            <Users className={s.color}/>

            <div>

              <p className="text-gray-500 text-sm">
                {s.title}
              </p>

              <p className="font-semibold">
                {s.percent}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
