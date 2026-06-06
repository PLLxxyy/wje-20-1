export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString('zh-CN')
}

export function isAbnormal(value: number, type: string): boolean {
  switch (type) {
    case 'systolic':
      return value > 140 || value < 90
    case 'diastolic':
      return value > 90 || value < 60
    case 'bloodSugar':
      return value > 6.1 || value < 3.9
    case 'heartRate':
      return value > 100 || value < 60
    case 'cholesterol':
      return value > 5.2
    case 'uricAcid':
      return value > 420
    default:
      return false
  }
}
