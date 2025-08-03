export const getMonthColor = (month: string): string => {
  switch (month) {
    case "luglio":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "agosto":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "settembre":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "oltre":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}
