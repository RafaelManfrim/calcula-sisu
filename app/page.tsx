'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { InputControl } from "./components/InputControl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { api } from "./lib/axios";
import toast from "react-hot-toast";
import LogoImg from "@/app/assets/logo.png"

type City = {
  id: string
  nome: string
  uf: string
  slug: string
}

type University = {
  campus: string
  slug: string
  id: string
  cidade: string
  uf: string
  universidade: string
  slugUni: string
  numCursos: string
}

type Course = {
  id: string
  nome: string
  tipocurso: string
  slug: string
  slugTipoCurso: string
  turno: string
  ultimaEdicao: string
  cidade: string
  uf: string
  campus: string
  slugCampus: string
  universidade: string
  slugUni: string
}

type NotaDeCorte = {
  ano: string
  descricao: string
  nota: string
}

type CourseInfo = {
  id: string
  nome: string
  universidade: string
  campus: string
  cidade: string
  uf: string
  turno: string
  pesoLing: string
  pesoMat: string
  pesoCH: string
  pesoCN: string
  pesoRed: string
  mediaMinLin: string
  mediaMinMat: string
  mediaMinCH: string
  mediaMinCN: string
  mediaMinRed: string
  mediaMinGeral: string
  bonus: null
  bonusComentario: null
  notasDeCorte: NotaDeCorte[]
  slugUni: string
  slugCampus: string
  vagas: string
}

const simulatorSchema = z.object({
  math_score: z.number({
    invalid_type_error: "A nota precisa ser um número",
    required_error: "A nota é obrigatória"
  }).min(0, "A nota precisa ser positiva").max(1000, "A nota precisa ser menor do que 1000"),
  languages_score: z.number({
    invalid_type_error: "A nota precisa ser um número",
    required_error: "A nota é obrigatória"
  }).min(0, "A nota precisa ser positiva").max(1000, "A nota precisa ser menor do que 1000"),
  human_science_score: z.number({
    invalid_type_error: "A nota precisa ser um número",
    required_error: "A nota é obrigatória"
  }).min(0, "A nota precisa ser positiva").max(1000, "A nota precisa ser menor do que 1000"),
  science_score: z.number({
    invalid_type_error: "A nota precisa ser um número",
    required_error: "A nota é obrigatória"
  }).min(0, "A nota precisa ser positiva").max(1000, "A nota precisa ser menor do que 1000"),
  essay_score: z.number({
    invalid_type_error: "A nota precisa ser um número",
    required_error: "A nota é obrigatória"
  }).min(0, "A nota precisa ser positiva").max(1000, "A nota precisa ser menor do que 1000"),
})

export type SimulatorFormSchema = z.infer<typeof simulatorSchema>

type SimulatorResponse = {

}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  const [cities, setCities] = useState<City[]>()
  const [universities, setUniversities] = useState<University[]>()
  const [courses, setCourses] = useState<Course[]>()

  const [selectedCity, setSelectedCity] = useState<City>()
  const [selectedUniversity, setSelectedUniversity] = useState<University>()

  const [courseInfo, setCourseInfo] = useState<CourseInfo>()

  const [simulatorResponse, setSimulatorResponse] = useState<SimulatorResponse>()

  const simulatorForm = useForm<SimulatorFormSchema>({
    resolver: zodResolver(simulatorSchema)
  })

  async function handleSimulate(data: SimulatorFormSchema) {
    setIsLoading(true)

    try {
      // const response = await api.post("/api/simulate", data)

      // console.log(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCities() {
    setIsLoadingCities(true)

    try {
      const response = await api.get("fetch_cities")

      const cities_sorted = response.data.sort(
        (a: City, b: City) => a.nome.localeCompare(b.nome)
      )

      setCities(cities_sorted)
    } catch (error) {
      console.log(error)

      toast.error("Erro ao carregar as cidades")
    } finally {
      setIsLoadingCities(false)
    }
  }

  async function fetchUniversities() {
    if (!selectedCity) return

    setIsLoadingUniversities(true)

    try {
      const response = await api.get(`fetch_universities/${selectedCity.uf}/${selectedCity.slug}`)

      setUniversities(response.data)
    } catch (error) {
      console.log(error)

      toast.error("Erro ao carregar as universidades")
    } finally {
      setIsLoadingUniversities(false)
    }
  }

  async function fetchCourses() {
    if (!selectedUniversity) return

    setIsLoadingCourses(true)

    try {
      const response = await api.get(`fetch_courses/${selectedUniversity.slugUni}/${selectedUniversity.slug}`)

      setCourses(response.data)
    } catch (error) {
      console.log(error)

      toast.error("Erro ao carregar os cursos")
    } finally {
      setIsLoadingCourses(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (!selectedCity) return

    fetchUniversities()
  }, [selectedCity])

  useEffect(() => {
    if (!selectedUniversity) return

    fetchCourses()
  }, [selectedUniversity])

  useEffect(() => {
    const errors = simulatorForm.formState.errors

    if (Object.keys(errors).length === 0) return

    console.log(errors)
  }, [simulatorForm.formState.errors])

  return (
    <main>
      <header className="bg-orange-400 p-4 px-12 flex justify-center items-center">
        <Image className="dark:invert" src={LogoImg} alt="ENEM Simulator Logo" width={180} height={38} priority />
      </header>

      <section className="bg-white max-w-4xl mx-auto mt-14 p-4 rounded-md shadow-md">
        <h1 className="text-orange-400 font-bold text-4xl">
          Simulador de Nota via SISU
        </h1>

        <form className="mt-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <InputControl labelText="Nota de Linguagens" register={simulatorForm.register("languages_score", { valueAsNumber: true })} />
          </div>
          <div className="flex gap-3">
            <InputControl labelText="Nota de Matemática" register={simulatorForm.register("math_score", { valueAsNumber: true })} />
          </div>

          <div className="flex gap-3">
            <InputControl labelText="Nota de Redação" register={simulatorForm.register("essay_score", { valueAsNumber: true })} />
          </div>

          <div className="flex gap-3">
            <InputControl labelText="Nota de Ciências Humanas" register={simulatorForm.register("human_science_score", { valueAsNumber: true })} />
          </div>

          <div className="flex gap-3">
            <InputControl labelText="Nota de Ciências da Natureza" register={simulatorForm.register("science_score", { valueAsNumber: true })} />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-lg" htmlFor="city">Selecione uma cidade</label>
            <select className="bg-background p-2 px-4 h-10 text-xl" name="city" id="city">
              {cities && cities.map(city => <option value={city.slug}>{city.nome}</option>)}
            </select>
          </div>

          <div>
            Selecione uma universidade
            <select name="" id=""></select>
          </div>

          <div>
            Selecione o curso desejado
            <select name="" id=""></select>
          </div>

          <button
            type="submit"
            className="text-white font-bold p-2 bg-orange-400 rounded-md cursor-pointer hover:brightness-95 transition-all mt-8"
            onClick={simulatorForm.handleSubmit(handleSimulate)}
          >
            Calcular
          </button>
        </form>
      </section>
      {simulatorResponse && (
        <section className="bg-white max-w-4xl mx-auto mt-4 p-4 rounded-md shadow-md">
          <h1 className="text-orange-400 font-bold text-4xl">
            Resultado
          </h1>

          {/* <p className="mt-2">
                A sua nota baseada nos dados informados será: {' '}
                <span className="text-orange-400 font-bold">
                  {simulatorResponse.finalNote.toFixed(2)}
                </span>
              </p> */}
        </section>
      )}

    </main>
  );
}
