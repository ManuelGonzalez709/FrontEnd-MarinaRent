"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import axios from "axios"
import { API_URL } from "../utilities/apirest";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Fecha actual
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const url = API_URL + "api/obtenerReservasUsuario";
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios.get(url, { headers })
      .then((response) => {
        const eventosTransformados = response.data.map((reserva) => ({
          id: reserva.id.toString(),
          title: reserva.publicacion.titulo,
          date: new Date(reserva.fecha_reserva),
        }));

        setEvents(eventosTransformados);

        // Establecer la fecha principal al primer evento del array transformado
        if (eventosTransformados.length > 0) {
          setCurrentMonth(eventosTransformados[0].date);
        }

        console.log("Eventos cargados:", eventosTransformados);
      })
      .catch((error) => {
        console.error("Error al cargar los eventos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getMonthData = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek === -1) firstDayOfWeek = 6 // Convert Sunday from 0 to 6

    // Calculate the number of days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate the total number of days to display (max 42 for 6 weeks)
    const totalDays = 42

    // Create an array of date objects for the calendar
    const calendarDays = []

    // Add days from the previous month
    const prevMonth = new Date(year, month - 1)
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      calendarDays.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i),
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    const nextMonth = new Date(year, month + 1)
    const remainingDays = totalDays - calendarDays.length

    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
      })
    }

    // Group the days into weeks
    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7))
    }

    return weeks
  }

  const weeks = getMonthData(currentMonth)

  const formatMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentMonth(new Date()) // Establecer a la fecha actual
  }

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const isHighlighted = (date) => {
    // Verificar si la fecha es el 12 de enero de 2022
    return date.getDate() === 12 && date.getMonth() === 0 && date.getFullYear() === 2022
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full mt-5 mb-15 mx-auto bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">{formatMonth(currentMonth)}</h2>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none border-r h-10" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none h-10" onClick={handleToday}>
                  Hoy
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none border-l h-10" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-12rem)] min-h-[600px]">
            {weeks.flat().map((day, index) => {
              const dayEvents = getEventsForDate(day.date)
              const isHighlightedDay = isHighlighted(day.date)

              return (
                <div key={index} className={`border-b border-r p-1 relative ${!day.isCurrentMonth ? "text-gray-400" : ""}`}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      {isHighlightedDay ? (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white">
                          {day.date.getDate()}
                        </div>
                      ) : (
                        <span className="p-1">{day.date.getDate()}</span>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto mt-1">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="text-xs p-1 mb-1 truncate">
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
