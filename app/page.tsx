'use client'

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { InputControl } from "./components/InputControl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { api } from "./lib/axios";
import toast from "react-hot-toast";
import LogoImg from "@/app/assets/logo.png"
import { CustomSelect } from "./components/CustomSelect";
import clsx from "clsx";

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

type History = {
  [year: string]: NotaDeCorte[]
}

type SimulatorResponse = {
  notes: SimulatorFormSchema
  course: CourseInfo
  finalNote: number
  history: History
}

// export function unselectUnavailableOption(
//   selectedOption: SelectOption | null | undefined,
//   availableOption: SelectOption,
// ): SelectOption | null {
//   if (selectedOption && availableOption) {
//     const selectedOptionsAvailable = selectedOptions.reduce(
//       (optionsArrayAcc, selectedOption) => {
//         let option: SelectOption | undefined

//         availableOptions.every((availableOption) => {
//           if (availableOption.value === selectedOption.value) {
//             option = availableOption
//           } else if (
//             availableOption.options &&
//             availableOption.options.length > 0
//           ) {
//             option = (availableOption.options as SelectOption[]).find(
//               (availableSubOption) =>
//                 availableSubOption.value === selectedOption.value &&
//                 (!availableSubOption.runs ||
//                   availableSubOption.runs.length > 0),
//             )
//           }

//           return !option
//         })

//         if (option) {
//           optionsArrayAcc.push(option)
//         }

//         return optionsArrayAcc
//       },
//       {} as SelectOption,
//     )

//     // console.log('Selected Models Available: ', selectedOptionsAvailable)

//     // console.log('========================')
//     return selectedOption
//   }

//   return null
// }

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  const [cities, setCities] = useState<City[]>()
  const [universities, setUniversities] = useState<University[]>()
  const [courses, setCourses] = useState<Course[]>()

  const [selectedCity, setSelectedCity] = useState<City>()
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>()

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

      const history = courseInfo.notasDeCorte.reduce((acc: History, nota: NotaDeCorte) => {
        if (Number(nota.nota) === 0) {
          return acc;
        }

        if (acc[nota.ano]?.find((notaDeCorte) => notaDeCorte.descricao === nota.descricao)) {
          return acc;
        }
        
        if (!acc[nota.ano]) {
          acc[nota.ano] = [];
        }

        acc[nota.ano].push(nota);
        return acc;
      }, {})

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
        history
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
    if (!selectedCity) {
      setUniversities(undefined)
      return
    }

    fetchUniversities()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity])

  useEffect(() => {
    if (!selectedUniversity) {
      setCourses(undefined)
      return
    }

    fetchCourses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniversity])

  return (
    <main>
      <header className="bg-orange-400 p-4 px-12 flex justify-center items-center">
        <Image src={LogoImg} alt="ENEM Simulator Logo" width={180} height={38} priority />
      </header>

      <section className="bg-white max-w-4xl mx-auto mt-14 p-4 rounded-md shadow-md">
        <h1 className="text-orange-400 font-bold text-4xl text-center">
          Simulador de Nota via SISU
        </h1>

        <form className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-lg" htmlFor="city">Selecione uma cidade</label>
            <CustomSelect
              id="city"
              options={cities}
              value={selectedCity}
              onChange={(options) => {
                setSelectedCity(options as City)
                setSelectedUniversity(null)
                setSelectedCourse(null)
              }}
              isDisabled={isLoadingCities}
              openMenuOnFocus
              backgroundColor="#f7f7f7"
            />
          </div>

          <div>
            <label className="text-lg" htmlFor="university">Selecione uma universidade</label>
            <CustomSelect
              id="university"
              options={universities}
              value={selectedUniversity}
              onChange={(options) => {
                setSelectedUniversity(options as University)
                setSelectedCourse(null)
              }}
              isDisabled={isLoadingUniversities}
              openMenuOnFocus
              backgroundColor="#f7f7f7"
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
              backgroundColor="#f7f7f7"
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
            {isLoading ? "Carregando..." : "Calcular"}
          </button>
        </form>
      </section>
      {simulatorResponse && (
        <section className="bg-white max-w-4xl mx-auto mt-4 p-4 rounded-md shadow-md">
          <h1 className="text-orange-400 font-bold text-4xl text-center">
            Resultado
          </h1>

          <div className="overflow-x-auto mt-3">
            <table className="shadow-md w-full text-center">
              <thead>
                <tr>
                  <th colSpan={5} className="bg-orange-400 text-white border border-orange-400">Pesos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-orange-400">Redação</td>
                  <td className="border border-orange-400 font-bold w-16">{+simulatorResponse.course.pesoRed}</td>
                </tr>
                <tr>
                  <td className="border border-orange-400">Linguagens</td>
                  <td className="border border-orange-400 font-bold">{+simulatorResponse.course.pesoLing}</td>
                </tr>
                <tr>
                  <td className="border border-orange-400">Matemática</td>
                  <td className="border border-orange-400 font-bold">{+simulatorResponse.course.pesoMat}</td>
                </tr>
                <tr>
                  <td className="border border-orange-400">Ciências Humanas</td>
                  <td className="border border-orange-400 font-bold">{+simulatorResponse.course.pesoCH}</td>
                </tr>
                <tr>
                <td className="border border-orange-400">Ciências da Natureza</td>
                  <td className="border border-orange-400 font-bold">{+simulatorResponse.course.pesoCN}</td>
                </tr>
              </tbody>
            </table>
          </div>
          

          <table className="shadow-md w-full text-center mt-5">
            <thead>
              <tr>
                <th colSpan={5} className="bg-orange-400 text-white border border-orange-400">
                  A sua nota baseada nos dados informados
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-orange-400 font-bold">{simulatorResponse.finalNote.toFixed(2).replace(".", ",")}</td>
              </tr>
            </tbody>
          </table>

          <table className="shadow-md w-full text-center mt-5">
            <thead>
              <tr>
                <th colSpan={5} className="bg-orange-400 text-white border border-orange-400">
                  Histórico de Notas de Corte
                </th>
              </tr>
            </thead>
            {Object.entries(simulatorResponse.history).reverse().map(([year, notasDeCorte]) => (
              <Fragment key={year}>
                <thead>
                  <tr>
                    <th colSpan={5} className="bg-orange-400 text-white border border-orange-400">
                      {year}
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-orange-400">Descrição</th>
                    <th className="border border-orange-400">Nota de Corte</th>
                  </tr>
                </thead>
                <tbody>
                  {notasDeCorte.sort((a, b) => Number(b.nota) - Number(a.nota)).map((notas) => (
                    <tr key={`${year}-${notas.descricao}`}>
                      <td className="border border-orange-400 text-justify text-sm px-2">
                        {notas.descricao}
                      </td>
                      <td className={clsx(
                        "border border-orange-400 font-bold text-orange-400", 
                        Number(notas.nota) > simulatorResponse.finalNote + 30 && "text-red-500", 
                        Number(notas.nota) < simulatorResponse.finalNote - 30 && "text-green-500"
                        )}
                        title={Number(notas.nota) > simulatorResponse.finalNote + 30 ? "Chances baixas de entrar com base em sua nota" : Number(notas.nota) < simulatorResponse.finalNote - 30 ? "Chances altas de entrar com base em sua nota" : "Chances médias de entrar com base em sua nota" }
                      >
                        {notas.nota}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Fragment>
            ))}
          </table>
        </section>
      )}

      <footer className="bg-orange-400 p-4 px-12 mt-14 flex flex-col gap-4 justify-center items-center">
        <span className="text-center mt-4 max-w-[512px]">
          O Calcula SISU é uma ferramenta desenvolvida para ajuda estudantes a terem uma noção de suas chances de entrar em um curso de ensino superior com base em dados históricos. Sendo assim, não garantimos a entrada em um curso de ensino superior.
        </span>
        <strong>
          Projeto Extensionista - IFSP Catanduva - 2024
        </strong>
        <span>
          Autores:
          Rafael Manfrim, Ana Rita Pavão Green e Thiago Lopes Franco
        </span>
      </footer>
    </main>
  );
}
