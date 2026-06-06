interface AbnormalBadgeProps {
  value: number
  type: string
}

export default function AbnormalBadge({ value, type }: AbnormalBadgeProps) {
  const isAbnormal = () => {
    switch (type) {
      case 'systolic': return value > 140 || value < 90
      case 'diastolic': return value > 90 || value < 60
      case 'bloodSugar': return value > 6.1 || value < 3.9
      case 'heartRate': return value > 100 || value < 60
      case 'cholesterol': return value > 5.2
      case 'uricAcid': return value > 420
      default: return false
    }
  }

  if (!isAbnormal()) return null

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
      异常
    </span>
  )
}
