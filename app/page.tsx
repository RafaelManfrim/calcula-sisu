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
import { CustomSelect } from "./components/CustomSelect";

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
  notes: SimulatorFormSchema
  course: CourseInfo
  finalNote: number
  history: NotaDeCorte[]
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
  const [selectedCourse, setSelectedCourse] = useState<Course>()

  const [simulatorResponse, setSimulatorResponse] = useState<SimulatorResponse>()

  const simulatorForm = useForm<SimulatorFormSchema>({
    resolver: zodResolver(simulatorSchema)
  })

  async function handleSimulate(data: SimulatorFormSchema) {
    if (!selectedCourse) return

    setIsLoading(true)

    try {
      const response = await api.get(`/fetch_course/${selectedCourse.id}`)
      const courseInfo = response.data[0]

      setSimulatorResponse({
        notes: data,
        course: courseInfo,
        finalNote: (Number(courseInfo.pesoMat) * data.math_score +
          Number(courseInfo.pesoLing) * data.languages_score +
          Number(courseInfo.pesoCH) * data.human_science_score +
          Number(courseInfo.pesoCN) * data.science_score +
          Number(courseInfo.pesoRed) * data.essay_score)
          /
          (Number(courseInfo.pesoMat) +
            Number(courseInfo.pesoLing) +
            Number(courseInfo.pesoCH) +
            Number(courseInfo.pesoCN) +
            Number(courseInfo.pesoRed)),
        history: courseInfo.notasDeCorte.reverse()
      })
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
      ).map((city: City) => ({
        ...city,
        value: city.id,
        label: city.nome
      }))

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
      const response = await api.get(`fetch_colleges/${selectedCity.uf}/${selectedCity.slug}`)

      setUniversities(response.data.map(
        (university: University) => ({
          ...university,
          value: university.id,
          label: `${university.slugUni.toUpperCase()} - ${university.campus}`
        })
      ))
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

      setCourses(response.data.map(
        (course: Course) => ({
          ...course,
          value: course.id,
          label: course.nome
        }))
      )
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
    const errors = simulatorForm.formState.errors

    if (Object.keys(errors).length === 0) return

    console.log(errors)
  }, [simulatorForm.formState.errors])

  return (
    <main className="mb-14">
      <header className="bg-orange-400 p-4 px-12 flex justify-center items-center">
        <Image className="dark:invert" src={LogoImg} alt="ENEM Simulator Logo" width={180} height={38} priority />
      </header>

      <section className="bg-white max-w-4xl mx-auto mt-14 p-4 rounded-md shadow-md">
        <h1 className="text-orange-400 font-bold text-4xl">
          Simulador de Nota via SISU
        </h1>

        <form className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-lg" htmlFor="city">Selecione uma cidade</label>
            <CustomSelect
              id="city"
              options={cities}
              value={selectedCity}
              onChange={(options) => setSelectedCity(options as City)}
              isDisabled={isLoadingCities}
              onMenuClose={() => {
                setSelectedUniversity(undefined)
                fetchUniversities()
              }}
              openMenuOnFocus
            />
          </div>

          <div>
            <label className="text-lg" htmlFor="university">Selecione uma universidade</label>
            <CustomSelect
              id="university"
              options={universities}
              value={selectedUniversity}
              onChange={(options) => setSelectedUniversity(options as University)}
              isDisabled={isLoadingUniversities}
              onMenuClose={() => {
                setSelectedCourse(undefined)
                fetchCourses()
              }}
              openMenuOnFocus
            />
          </div>

          <div>
            <label className="text-lg" htmlFor="course">Selecione o curso desejado</label>
            <CustomSelect
              id="course"
              options={courses}
              value={selectedCourse}
              onChange={(options) => setSelectedCourse(options as Course)}
              isDisabled={isLoadingCourses}
              openMenuOnFocus
            />
          </div>

          <InputControl labelText="Nota de Linguagens" disabled={!selectedCourse} register={simulatorForm.register("languages_score", { valueAsNumber: true })} />

          <InputControl labelText="Nota de Matemática" disabled={!selectedCourse} register={simulatorForm.register("math_score", { valueAsNumber: true })} />

          <InputControl labelText="Nota de Redação" disabled={!selectedCourse} register={simulatorForm.register("essay_score", { valueAsNumber: true })} />

          <InputControl labelText="Nota de Ciências Humanas" disabled={!selectedCourse} register={simulatorForm.register("human_science_score", { valueAsNumber: true })} />

          <InputControl labelText="Nota de Ciências da Natureza" disabled={!selectedCourse} register={simulatorForm.register("science_score", { valueAsNumber: true })} />


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

          <p className="mt-2">
            A sua nota baseada nos dados informados será: {' '}
            <span className="text-orange-400 font-bold">
              {simulatorResponse.finalNote}
            </span>
          </p>

          <p className="mt-2">Pesos:</p>
          <p className="text-orange-400 font-bold">
            <span className="text-slate-800">Linguagens:</span> {+simulatorResponse.course.pesoLing}
          </p>
          <p className="text-orange-400 font-bold">
            <span className="text-slate-800">Matemática:</span> {+simulatorResponse.course.pesoMat}
          </p>
          <p className="text-orange-400 font-bold">
            <span className="text-slate-800">Ciências Humanas:</span> {+simulatorResponse.course.pesoCH}
          </p>
          <p className="text-orange-400 font-bold">
            <span className="text-slate-800">Ciências da Natureza:</span> {+simulatorResponse.course.pesoCN}
          </p>
          <p className="text-orange-400 font-bold">
            <span className="text-slate-800">Redação:</span> {+simulatorResponse.course.pesoRed}
          </p>

          <p className="mt-2">Anos Anteriores:</p>

          {simulatorResponse.course.notasDeCorte.map((nota, index) => (
            <div key={index} className="mt-2">
              <p>
                - <span className="text-slate-800 font-semibold">{nota.ano}</span> {nota.descricao}
              </p>
              <p className="text-orange-400 font-bold">
                - <span className="text-slate-800">Nota de Corte:</span> {nota.nota}
              </p>
            </div>
          ))}
        </section>
      )}

    </main>
  );
}
