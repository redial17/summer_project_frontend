<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/index.ts'
import { userUpdateInfoService } from '@/api/user'
import { adminGetUserInfoService } from '@/api/admin'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { User, UserInfoForm } from '@/types'
import type { InternalRuleItem } from 'async-validator'

const userStore = useUserStore()

const route = useRoute()

const user = computed(() => {
  if (!userStore.user) {
    throw new Error('User not logged in or expired')
  }
  return userStore.user
})

const currentUser = ref<User | null>(null)
type DescriptionItem = {
  label: string
  value: string
}
const descriptionsItem = ref<DescriptionItem[]>([])
const form = ref<UserInfoForm>({
  id: '',
  password: '',
  repassword: '',
  firstName: '',
  lastName: '',
  assetHolder: {
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      postcode: '',
      city: '',
      country: ''
    },
    contact_preferences: {
      email: true,
      phone: false,
      whatsapp: false,
      discord: false,
      post: false,
      telegram: false
    }
  }
})
const formRef = ref()

const isEdit = ref(false)
// Avatar upload
// const avatarUrl = ref(assetHolder.value.avatar || '')
// const avatarFile = ref(null)

// const handleAvatarChange = (e) => {
//   const file = e.target.files[0]
//   if (!file) return

//   const reader = new FileReader()
//   reader.onload = () => {
//     avatarUrl.value = reader.result
//   }
//   reader.readAsDataURL(file)
//   avatarFile.value = file
// }

const rules = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    {
      min: 2,
      max: 30,
      message: 'First name must be 2–30 characters',
      trigger: 'blur'
    }
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' },
    {
      min: 2,
      max: 30,
      message: 'Last name must be 2–30 characters',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Phone is required', trigger: 'blur' },
    {
      validator: (
        rule: InternalRuleItem,
        value: string,
        callback: (_error?: Error) => void
      ) => {
        const phoneRegex = /^[0-9+\-()\s]{7,20}$/
        if (!phoneRegex.test(value)) {
          callback(new Error('Invalid phone number'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'assetHolder.address.street': [
    { required: true, message: 'Street is required', trigger: 'blur' }
  ],
  'assetHolder.address.postcode': [
    { required: true, message: 'Post code is required', trigger: 'blur' },
    {
      validator: (
        rule: InternalRuleItem,
        value: string,
        callback: (error?: Error) => void
      ) => {
        const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
        if (!ukPostcodeRegex.test(value)) {
          callback(new Error('Invalid UK postcode (e.g. SW1A 1AA)'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'assetHolder.address.city': [
    { required: true, message: 'City is required', trigger: 'blur' }
  ],
  'assetHolder.address.country': [
    { required: true, message: 'Country is required', trigger: 'blur' }
  ]
}

const userToForm = (user: User): UserInfoForm => {
  return {
    id: user.id,
    password: '',
    repassword: '',
    firstName: '',
    lastName: '',
    assetHolder: {
      name: user.assetHolder?.name ?? '',
      email: user.assetHolder?.email ?? '',
      phone: user.assetHolder?.phone ?? '',
      address: {
        street: user.assetHolder?.address?.street ?? '',
        postcode: user.assetHolder?.address?.postcode ?? '',
        city: user.assetHolder?.address?.city ?? '',
        country: user.assetHolder?.address?.country ?? ''
      },
      contact_preferences: {
        email: user.assetHolder?.contact_preferences.email ?? false,
        phone: user.assetHolder?.contact_preferences.phone ?? false,
        discord: user.assetHolder?.contact_preferences.discord ?? false,
        post: user.assetHolder?.contact_preferences.post ?? false,
        whatsapp: user.assetHolder?.contact_preferences.post ?? false,
        telegram: user.assetHolder?.contact_preferences.post ?? false
      }
    }
  }
}

const submit = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  try {
    const submitData = {
      ...form.value,
      assetHolder: {
        ...form.value.assetHolder,
        name: `${form.value.firstName} ${form.value.lastName}`
      }
    }

    console.log(submitData)
    const res = await userUpdateInfoService(user.value.id, submitData)
    console.log(res)
    ElMessage.success('Profile updated!')
    await userStore.getUserInfo()
    await loadUserData()

    isEdit.value = false
  } catch (error) {
    console.error('Update failed:', error)
    ElMessage.error('Failed to update profile')
  }
}

const loadUserData = async () => {
  try {
    if (user.value.admin) {
      currentUser.value = userStore.user
      console.log(userStore.user)
    } else {
      const id = (userStore.proxyId || route.query.id) as string
      const res = await adminGetUserInfoService(id)
      console.log(res)
      currentUser.value = res.data
    }

    if (!currentUser.value?.assetHolder) throw new Error('User does not exist')
    const arr = currentUser.value.assetHolder.name.split(' ')
    form.value = userToForm(currentUser.value)
    form.value.firstName = arr[0]
    form.value.lastName = arr[1]

    descriptionsItem.value = [
      { label: 'User id', value: user.value.id },
      { label: 'First name', value: arr[0] },
      { label: 'Last name', value: arr[1] },
      { label: 'Email', value: currentUser.value.assetHolder.email ?? '' },
      { label: 'Phone', value: currentUser.value.assetHolder.phone ?? '' },
      {
        label: 'Street',
        value: currentUser.value.assetHolder.address?.street ?? ''
      },
      {
        label: 'Postcode',
        value: currentUser.value.assetHolder.address?.postcode ?? ''
      },
      {
        label: 'City',
        value: currentUser.value.assetHolder.address?.city ?? ''
      },
      {
        label: 'Country',
        value: currentUser.value.assetHolder.address?.country ?? ''
      }
    ]
  } catch (error) {
    console.error('Failed to load user data:', error)
    ElMessage.error('Failed to load user data')
  }
}

const setEdit = (val: boolean) => {
  isEdit.value = val
}

onMounted(async () => {
  await loadUserData()
})

defineExpose({
  setEdit,
  submit,
  isEdit
})
</script>

<template>
  <el-descriptions title="User Info" :column="2" border v-if="!isEdit">
    <el-descriptions-item label="Avatar">
      <!-- <el-avatar :size="size" :src="circleUrl" /> -->
    </el-descriptions-item>
    <el-descriptions-item
      v-for="(item, index) in descriptionsItem"
      :key="index"
      :label="item.label"
    >
      {{ item.value }}</el-descriptions-item
    >
    <el-descriptions-item
      label="Contact preferences"
      v-if="user && user.assetHolder && user.assetHolder.contact_preferences"
    >
      <el-checkbox
        v-model="user.assetHolder.contact_preferences.email"
        :disabled="!isEdit"
        >Email</el-checkbox
      >
      <el-checkbox
        v-model="user.assetHolder.contact_preferences.phone"
        :disabled="!isEdit"
        >Phone</el-checkbox
      >
      <el-checkbox
        v-model="user.assetHolder.contact_preferences.discord"
        :disabled="!isEdit"
        >Discord</el-checkbox
      >
      <el-checkbox
        v-model="user.assetHolder.contact_preferences.post"
        :disabled="!isEdit"
        >Post</el-checkbox
      >
      <el-checkbox
        v-model="user.assetHolder.contact_preferences.telegram"
        :disabled="!isEdit"
        >Telegram</el-checkbox
      >
    </el-descriptions-item>
  </el-descriptions>
  <el-form
    v-else
    ref="formRef"
    :model="form"
    label-position="top"
    label-width="auto"
    style="max-width: 600px"
    :rules="rules"
  >
    <!-- Avatar upload -->
    <!-- <el-form-item label="Avatar">
      <div style="display: flex; align-items: center; gap: 16px">
        <el-avatar :src="avatarUrl" size="large" />
        <input type="file" accept="image/*" @change="handleAvatarChange" />
      </div>
    </el-form-item> -->

    <!-- name -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="FIRST NAME" prop="firstName">
          <el-input v-model="form.firstName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="LAST NAME" prop="lastName">
          <el-input v-model="form.lastName" />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- email -->
    <el-form-item label="EMAIL ADDRESS" prop="assetHolder.email">
      <el-input v-model="form.assetHolder.email" />
    </el-form-item>

    <!-- phone -->
    <el-form-item label="PHONE" prop="assetHolder.phone">
      <el-input v-model="form.assetHolder.phone" />
    </el-form-item>

    <!-- address -->
    <el-form-item label="ADDRESS">
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="12">
          <el-form-item
            label="Street"
            label-width="100px"
            prop="assetHolder.address.street"
          >
            <el-input v-model="form.assetHolder.address.street" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Post Code"
            label-width="100px"
            prop="assetHolder.address.postCode"
          >
            <el-input v-model="form.assetHolder.address.postcode" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="width: 100%">
        <el-col :span="12">
          <el-form-item
            label="City"
            label-width="100px"
            prop="assetHolder.address.city"
          >
            <el-input v-model="form.assetHolder.address.city" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Country"
            label-width="100px"
            prop="assetHolder.address.country"
          >
            <el-input v-model="form.assetHolder.address.country" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="Contact preferences">
      <el-checkbox
        label="Email"
        v-model="form.assetHolder.contact_preferences.email"
      />
      <el-checkbox
        label="Phone"
        v-model="form.assetHolder.contact_preferences.phone"
      />
      <el-checkbox
        label="Discord"
        v-model="form.assetHolder.contact_preferences.discord"
      />
      <el-checkbox
        label="Post"
        v-model="form.assetHolder.contact_preferences.post"
      />
      <el-checkbox
        label="telegram"
        v-model="form.assetHolder.contact_preferences.telegram"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
