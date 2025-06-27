<!-- <template>
  <div class="p-6 wfull">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Tickets</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Ticket
      </button>
    </div>

    <div v-if="tickets.length === 0" class="text-center text-gray-500">
      No tickets yet. Click "Create Ticket" to open a new one.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="ticket in tickets"
        :key="ticket.id"
        class="p-4 border rounded cursor-pointer hover:bg-gray-100"
        @click="goToDetail(ticket.id)"
      >
        <h2 class="font-semibold text-lg">{{ ticket.title }}</h2>
        <p class="text-gray-600">{{ ticket.content }}</p>
      </li>
    </ul>

    <CreateTicketModal v-if="showModal" @close="showModal = false" @created="fetchTickets" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateTicketModal from '../components/CreateTicketModal.vue'

const tickets = ref([] as any[])
const showModal = ref(false)
const router = useRouter()

const fetchTickets = () => {
  // Replace with actual fetch logic
  tickets.value = [
    { id: 1, title: 'Login issue', content: 'Unable to login to account.' },
    { id: 2, title: 'Bug in checkout', content: 'Cart not updating on checkout.' },
  ]
}

const goToDetail = (id: string) => {
  router.push(`/tickets/${id}`)
}

fetchTickets()
</script> -->

<template>
  <div class="p-6 w-full max-w-7xl mx-auto">
    <!-- Dashboard Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Ticket Dashboard</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Ticket
      </button>
    </div>

    <!-- Ticket Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white shadow rounded p-4 text-center">
        <p class="text-gray-500">Total Tickets</p>
        <p class="text-xl font-bold">{{ totalTickets }}</p>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <p class="text-gray-500">Open Tickets</p>
        <p class="text-xl font-bold">{{ openTickets }}</p>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <p class="text-gray-500">Closed Tickets</p>
        <p class="text-xl font-bold">{{ closedTickets }}</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by Ticket Key..."
        class="w-full md:w-1/3 p-2 border rounded"
      />
    </div>

    <!-- Ticket Table -->
    <div class="rounded-md border overflow-x-auto bg-background">
      <table class="w-full caption-bottom text-sm">
        <thead class="bg-muted/50 border-b">
          <tr class="text-left">
            <th class="px-4 py-3 text-muted-foreground font-medium">Title</th>
            <th class="px-4 py-3 text-muted-foreground font-medium">Content</th>
            <th class="px-4 py-3 text-muted-foreground font-medium">Status</th>
            <th class="px-4 py-3 text-muted-foreground font-medium">Created At</th>
            <th class="px-4 py-3 text-muted-foreground font-medium">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            @click="goToDetail(ticket.id)"
            class="border-b hover:bg-muted transition-colors"
          >
            <td class="px-4 py-3 font-medium">{{ ticket.title }}</td>
            <td class="px-4 py-3 truncate max-w-xs">{{ ticket.content }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 text-xs rounded font-semibold"
                :style="{ backgroundColor: ticket.color, color: 'black' }"
              >
                {{ ticket.status }}
              </span>
            </td>
            <td class="px-4 py-3">{{ formatDate(ticket.createdAt) }}</td>
            <td class="px-4 py-3 relative">
              <OptionsDropdown
                :ticketId="ticket.id"
                :isClosed="ticket.closed"
                @view="goToDetail"
                @delete="handleDelete"
                @close="handleClose"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredTickets.length === 0" class="text-center text-muted-foreground py-6">
        No tickets found.
      </div>
    </div>

    <CreateTicketModal v-if="showModal" @close="showModal = false" @created="fetchTickets" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CreateTicketModal from '../components/CreateTicketModal.vue'
// import OptionsDropdown from '../components/OptionsDropdown.vue'
import { useTicketsStore } from '@/stores/tickets'

const showModal = ref(false)
const searchTerm = ref('')
const router = useRouter()
const store = useTicketsStore()

const fetchTickets = async () => {
  await store.fetchTickets()
  store.tickets.forEach((ticket) => {
    ticket.color = getRandomColor()
  })
}

onMounted(fetchTickets)

const tickets = computed(() => store.tickets)
const totalTickets = computed(() => tickets.value.length)
const openTickets = computed(() => tickets.value.filter((t) => !t.closed).length)
const closedTickets = computed(() => tickets.value.filter((t) => t.closed).length)

console.log('the tickets are >>> ', tickets)

const filteredTickets = computed(() => {
  if (!searchTerm.value.trim()) return tickets.value
  return tickets.value.filter((t) => t.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const goToDetail = (id: string) => {
  router.push(`/tickets/${id}`)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const handleDelete = (id: string) => {
  console.log('Delete ticket', id)
  // Implement delete logic
}

const handleClose = (id: string) => {
  console.log('Close ticket', id)
  // Implement close logic
}

const getRandomColor = () => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6']
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<style scoped>
tr {
  transition: background-color 0.2s;
}
</style>
