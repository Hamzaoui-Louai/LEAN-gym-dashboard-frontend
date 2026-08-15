import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataSource } from './useDataSource'

export function useSourceData({ queryKey, queryFn, mockData, emptyValue = [] }) {
  const { source } = useDataSource()
  const queryClient = useQueryClient()
  const [local, setLocal] = useState(mockData)

  const isLive = source === 'api'

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: isLive,
    retry: false,
  })

  const data = isLive ? (query.data ?? emptyValue) : local

  const setData = (updater) => {
    if (!isLive) setLocal(updater)
  }

  const refetch = () => queryClient.invalidateQueries({ queryKey })

  return {
    data,
    setData,
    isLive,
    refetch,
    isPending: isLive && query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
  }
}
