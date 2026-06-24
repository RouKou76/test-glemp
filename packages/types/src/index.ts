export type Lang = 'ru' | 'en' | 'zh'

export type TicketType =
  | 'food'
  | 'transfer'
  | 'cleaning'
  | 'towels'
  | 'minibar'
  | 'gates'
  | 'custom'

export type TicketStatus =
  | 'new'
  | 'accepted'
  | 'in_progress'
  | 'done'
  | 'archived'

export type MenuCategory = 'breakfast' | 'lunch' | 'dinner' | 'minibar'

export type MealPeriod = 'breakfast' | 'lunch' | 'dinner' | 'none'

export type AssignedRole = 'cook' | 'cleaning' | 'driver' | 'admin'

export type HouseStatus = 'occupied' | 'vacant'

export type ServiceLocation = 'cabin' | 'terrace' | 'gazebo'

export interface TicketItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface Ticket {
  id: string
  houseId: string
  type: TicketType
  status: TicketStatus
  sentAt: string
  desiredAt?: string
  description?: string
  geo?: string
  assignedTo?: AssignedRole
  items?: TicketItem[]
  location?: ServiceLocation
  guestCount?: number
}

export type Translations = Partial<Record<Lang, {
  name: string
  description?: string
}>>

export interface MenuItem {
  id: string
  name: string
  description?: string
  category: MenuCategory
  price: number
  hidden: boolean
  showPrice: boolean
  translations?: Translations
}

export interface House {
  id: string
  number: number
  status: HouseStatus
  guestCount?: number
  lang: Lang
  checkInAt?: string
}

export interface ServiceField {
  enabled: boolean
  label?: string
}

export interface ServiceItem {
  id: string
  name: string
  price: number
  hidden: boolean
}

export interface ServiceFieldConfig {
  desiredAt?: ServiceField
  location?: ServiceField
  catalog?: ServiceField
  geo?: ServiceField
  guestCount?: ServiceField
  comment?: ServiceField
}

export interface Service {
  id: string
  name: string
  price?: string
  icon?: string
  active: boolean
  assignedTo: AssignedRole
  fields: ServiceFieldConfig
  items?: ServiceItem[]
  translations?: Translations
}

export interface TransferDestination {
  id: string
  name: string
  km: number
  price: number
}

export type MessageSender = 'guest' | 'admin' | AssignedRole

export interface Message {
  id: string
  houseId: string
  sender: MessageSender
  text: string
  timestamp: string
  read: boolean
}

export type WsEventType =
  | 'ticket:new'
  | 'ticket:updated'
  | 'message:new'
  | 'gate:request'
  | 'gate:confirmed'
  | 'connection:ping'

export interface WsEvent<T = unknown> {
  type: WsEventType
  payload: T
}
