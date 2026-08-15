import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataSource } from './useDataSource'

const DEFAULT_STALE_TIME = 5 * 60 * 1000

export function useSourceData({
  queryKey,
  queryFn,
  mockData,
  emptyValue = [],
  staleTime = DEFAULT_STALE_TIME,
}) {
  const { source } = useDataSource()
  const queryClient = useQueryClient()
  const [local, setLocal] = useState(mockData)

  const isLive = source === 'api'

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: isLive,
    retry: false,
    staleTime,
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
