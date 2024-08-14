"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { IMaskInput } from "react-imask";

type Time = `PT${number}M${number}S`; // Exemplo: "PT01M30S"

interface IEvaluationData {
  prancha: Time;
  forcaIsometricaMaos: Time;
}

const timeSchema = yup.object().shape({
  forcaIsometricaMaos: yup
    .string()
    .transform((_, val) => {
      if (val === "") return null;
      return val;
    })
    .matches(/^\d{2}:\d{2}$/, "Tempo inserido é inválido.")
    .test("time_check", function (timeInput) {
      if (timeInput == null) return true;

      let error = false;

      const [minStr, segStr] = timeInput.split(":");
      try {
        const min = Number(minStr);
        const seg = Number(segStr);
        if (isNaN(min) || isNaN(seg)) error = true;

        if (min < 0 || min >= 60) error = true;

        if (seg < 0 || seg >= 60) error = true;
      } catch (e) {
        return this.createError({
          message: "Tempo inserido é inválido.",
          path: this.path,
        });
      }

      if (error)
        return this.createError({
          message: "Tempo inserido é inválido.",
          path: this.path,
        });

      return true;
    })
    .nullable()
    .required("Valor obrigatório.")
    .typeError("Verifique se inseriu corretamente o tempo"),
  prancha: yup
    .string()
    .transform((_, val) => {
      if (val === "") return null;
      return val;
    })
    .matches(/^\d{2}:\d{2}$/, "Tempo inserido é inválido.")
    .test("time_check", function (timeInput) {
      if (timeInput == null) return true;

      let error = false;

      const [minStr, segStr] = timeInput.split(":");
      try {
        const min = Number(minStr);
        const seg = Number(segStr);
        if (isNaN(min) || isNaN(seg)) error = true;

        if (min < 0 || min >= 60) error = true;

        if (seg < 0 || seg >= 60) error = true;
      } catch (e) {
        return this.createError({
          message: "Tempo inserido é inválido.",
          path: this.path,
        });
      }

      if (error)
        return this.createError({
          message: "Tempo inserido é inválido.",
          path: this.path,
        });

      return true;
    })
    .nullable()
    .required("Valor obrigatório.")
    .typeError("Verifique se inseriu corretamente o tempo"),
});

interface FormData {
  prancha: string;
  forcaIsometricaMaos: string;
}

export default function Home() {
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormData>({
    mode: "onBlur",
    resolver: yupResolver(timeSchema),
  });

  const prancha = 15;
  const forca = 130;

  function minSecToPT(time: string | null): Time | null {
    if (!time) return null;
    const [minutes, seconds] = time.split(":").map(Number);
    // const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `PT${minutes}M${formattedSeconds}S` as Time;
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formattedData: IEvaluationData = {
      prancha: minSecToPT(data.prancha)!,
      forcaIsometricaMaos: minSecToPT(data.forcaIsometricaMaos)!,
    };
    console.log(formattedData);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Formulário de Tempo
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Prancha */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="prancha"
              className="mb-2 font-semibold text-lg text-black"
            >
              Prancha:
            </label>
            <Controller
              control={control}
              name="prancha"
              render={({ field: { onChange, onBlur, ref } }) => (
                <IMaskInput
                  type="text" // iMask não suporta o tipo 'number'
                  mask={["\\00{:}00", "00{:}00"]}
                  inputRef={ref}
                  onAccept={onChange}
                  onBlur={onBlur}
                  placeholder="MM:SS"
                  pattern="\d*" // Habilita teclado numérico em dispositivos móveis
                  inputMode="numeric" // Habilita teclado numérico em dispositivos móveis
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  style={{ color: "#000" }}
                />
              )}
            />
            {errors.prancha && (
              <span className="text-red-500 text-sm mt-2">
                {errors.prancha.message}
              </span>
            )}
          </div>
          {/* Força de Preensão */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="forcaIsometricaMaos"
              className="mb-2 font-semibold text-lg text-black"
            >
              Força de Preensão:
            </label>
            <Controller
              name="forcaIsometricaMaos"
              control={control}
              render={({ field: { onChange, onBlur, ref } }) => (
                <IMaskInput
                  type="text" // iMask não suporta o tipo 'number'
                  mask={["\\00{:}00", "00{:}00"]}
                  inputRef={ref}
                  onAccept={onChange}
                  onBlur={onBlur}
                  placeholder="MM:SS"
                  pattern="\d*" // Habilita teclado numérico em dispositivos móveis
                  inputMode="numeric" // Habilita teclado numérico em dispositivos móveis
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  style={{ color: "#000" }}
                />
              )}
            />
            {errors.forcaIsometricaMaos && (
              <span className="text-red-500 text-sm mt-2">
                {errors.forcaIsometricaMaos.message}
              </span>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
