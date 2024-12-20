import { LastTwoKeys, TypeRecord } from 'src/types'
import useRecordsStore from '#/records/store/useRecordsStore.ts'
import { useCreateRecordDialog } from '#/records/store/dialog.ts'
import { RecordsTable } from '#/records/components/RecordsTable.tsx'
import { Toaster } from '@/components/Toaster'
import { toast } from '@/lib/useToast'
import { ToastProps } from '@/components/Toast.tsx'
import Controls from './Controls'
import { useEffect, useState, lazy, Suspense } from 'react'
import useReportStore from '../store/useReportStore'
import getMostRecord from '../services/get_most_record.ts'
import { BarList } from '@/components/BarList.tsx'
import OverlayLoader from '@/components/OverlayLoader.tsx'

type barlistData = {
  name: string
  value: number
}

const RecordDialog = lazy(() => import('#/records/components/DialogRecord.tsx'))
const ReportDialog = lazy(() => import('#/report/components/ReportDialog.tsx'))

export default function DashboardContent({
  titleContent,
  type,
  barlist
}: {
  titleContent: string
  type: TypeRecord
  barlist: LastTwoKeys
}) {
  const { error, loading, records, fetchRecords } = useRecordsStore()
  const { stateRecordDialog, closeRecordDialog } = useCreateRecordDialog()
  const { stateReportDialog, closeReportDialog } = useReportStore()
  const [bar, setBar] = useState<barlistData[]>([])
  const [toastInfo, setToastInfo] = useState<ToastProps | undefined>()

  useEffect(() => {
    fetchRecords(type)

    getMostRecord({ endpoint: barlist }).then(setBar)

    closeRecordDialog()
    closeReportDialog()
  }, [])

  useEffect(() => {
    if (toastInfo) {
      toast(toastInfo)
    }
  }, [toastInfo])
  return (
    <main className="col-start-4 col-span-9 overflow-y-scroll px-9 pt-6">
      {stateRecordDialog && (
        <Suspense fallback={<OverlayLoader />}>
          <RecordDialog type={type} setToast={setToastInfo} />
        </Suspense>
      )}
      {stateReportDialog && (
        <Suspense fallback={<OverlayLoader />}>
          <ReportDialog />
        </Suspense>
      )}
      <Controls />
      <Toaster />
      <section className="my-4 grid grid-cols-2">
        <div className="col-start-1 col-span-1 border-[1px] border-[#CCDBDC] rounded-lg p-3">
          <h5 className="mb-2 font-bold text-deep-blue">
            {barlist === 'MOST_CONSUMED'
              ? 'Top 5 más consumidos'
              : 'Top 5 más ingresados'}
          </h5>
          <BarList data={bar} />
        </div>
      </section>
      <RecordsTable
        data={records}
        title={titleContent}
        isLoading={loading}
        hasError={Boolean(error)}
        errorMessage={error}
        type={type}
      />
    </main>
  )
}
