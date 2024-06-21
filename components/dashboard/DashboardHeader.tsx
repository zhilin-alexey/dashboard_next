"use client";



export function DashboardHeader({logout}: {logout: () => void}) {
  
  return (
    <div className="flex justify-between items-center pb-5">
      <h1 className="text-2xl">Панель управления</h1>
      <button onClick={() => logout()}>Выйти</button>
    </div>
  );
}
