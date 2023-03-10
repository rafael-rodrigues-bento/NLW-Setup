import { View, Text, ScrollView, Alert } from "react-native";

import { api } from "../lib/axios";

import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill =  minimumSummaryDatesSizes - datesFromYearStart.length

type DataSummaryProps = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

export function Home() {
  const [loading, setLoading] = useState(true);
  const [dataSummary, setDataSummary] = useState<DataSummaryProps | null>(null)

  const { navigate } = useNavigation()

  async function fetchData() {
    try {
      setLoading(true)
      const response = await api.get('/summary')

      setDataSummary(response.data)
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if(loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      
      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, i) => {
            return (
              <Text 
                key={`${weekDay}-${i}`}
                className="text-zinc-400 text-xl font-bold text-center mx-1" 
                style={{width: DAY_SIZE}}
              >
                {weekDay}
              </Text>
            )
          })
        }
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100}}
      >
        {
          dataSummary &&
          <View className="flex-row flex-wrap">
          { 
              datesFromYearStart.map(date => {
                const dayWithHabits = dataSummary.find(day =>{
                  return dayjs(date).isSame(day.date)
                })

                return (
                  <HabitDay
                    date={date}
                    amountCompleted={dayWithHabits?.completed}
                    amountOfHabits={dayWithHabits?.amount}
                    key={date.toISOString()}
                    onPress={() => navigate('habit', {date: date.toISOString()})}
                  />
                )
              })
          }

          {
            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
              return (
                <View
                  key={i} 
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{width: DAY_SIZE, height: DAY_SIZE}}
                /> 
              )
            })}   
          </View>
        }
      </ScrollView>    
    </View>
  )
}