import { SendIcon } from '@/components/Icons'

export default function CreateReportButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 font-bold text-base text-deep-blue py-1 px-3 border-[1px] border-deep-blue rounded-lg hover:outline hover:outline-soft-teal hover:outline-4"
    >
      <SendIcon />
      Generar Reporte
    </button>
  )
}