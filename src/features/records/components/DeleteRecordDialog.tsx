import Overlay from '@/components/Overlay'
import { Dispatch, FormEvent } from 'react'
import { dialog, record_type_id, viewRecord } from 'src/types'
import deleteRecord from '../services/delete_record'
import useRecordsStore from '../store/useRecordsStore'
import { Toaster } from '@/components/Toaster'
import { useToast } from '@/lib/useToast'

export default function DeleteRecordDialog({
  id,
  type,
  set
}: {
  id: number | null
  type: record_type_id
  set: Dispatch<React.SetStateAction<dialog>>
}) {
  const { fetchRecords } = useRecordsStore()
  const { toast } = useToast()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (id !== null) {
      deleteRecord({ id }).then((msg) => {
        console.info(msg)
        set({
          id: null,
          isOpen: false
        })

        const stringType: viewRecord =
          type === 1 ? 'incomesEndpoint' : 'expensesEndpoint'
        fetchRecords(stringType).then(() => {
          toast({
            title: 'Info',
            description: 'El registro fue borrado exitosamente',
            variant: 'info',
            duration: 3000
          })
        })
      })
    }
  }
  return (
    <>
      <Toaster />
      <Overlay>
        <form
          className="w-1/2 lg:w-1/4 bg-white p-6 rounded-lg"
          onSubmit={handleSubmit}
        >
          <section className="flex items-start justify-between">
            <h3 className="text-deep-blue font-bold text-xl mb-4">
              ¿Desea borrar este registro?
            </h3>
          </section>

          <section className="flex justify-start gap-3">
            <button
              type="button"
              className="border-[1px] border-deep-blue rounded-md px-2 py-1 text-deep-blue hover:text-white hover:bg-deep-blue transition-all duration-150 ease-in-out"
              onClick={() => set((prev) => ({ ...prev, isOpen: false }))}
              aria-label="Cerrar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="border-[1px] border-sky-blue rounded-md px-3 py-1 text-white bg-sky-blue transition-all duration-150 ease-in-out"
              aria-label="Boton borrar registro"
            >
              Borrar
            </button>
          </section>
        </form>
      </Overlay>
    </>
  )
}