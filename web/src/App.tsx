import { Habit } from "./components/Habit"

function App() {
  return (
    <>
      <Habit completed={3}/>
      <Habit completed={10}/>
      <Habit completed={21}/>
      <Habit completed={2}/>
    </>
  )
}

export default App
