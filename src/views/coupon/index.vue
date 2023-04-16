<template>
  <div class="course-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15" style="position: relative">
        <el-button size="default" type="success" class="ml10" @click="onAdd" plain>
          <el-icon>
            <ele-Plus/>
          </el-icon>
          生成优惠卷
        </el-button>
        <el-input v-model="searchKey" placeholder="搜索卷码" clearable class="w-50 m-2" size="default"
                  style="max-width: 300px;position: absolute;right: 30px">
          <template #append>
            <el-button @click="search">
              <SvgIcon name="ele-Search"></SvgIcon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-table :data="currentData" style="width: 100%" ref="tableRef" v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="编号" prop="id" align="center"></el-table-column>
        <el-table-column label="兑换人id" prop="userId" align="center"></el-table-column>
        <el-table-column prop="code" label="优惠卷卷码" align="center"></el-table-column>
        <el-table-column prop="limit" label="额度" align="center"></el-table-column>
        <el-table-column prop="isValid" label="是否有效" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.isValid">有效</el-tag>
            <el-tag type="info" v-else>无效</el-tag>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </el-card>
    <Add ref="addRef" @tableChange='initTableData'></Add>
    <Edit ref="editRef" @tableChange='initTableData'></Edit>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import {ElMessage} from "element-plus";
import {IData} from "/@/views/coupon/interface";
import Add from "/@/views/coupon/component/add.vue";
import {initCouponTable, searchInfo} from "/@/api/coupon/index.ts";


// 页面数据：表格数据、分页数据
interface TableState {
  data: Array<IData>
  total: number;
  loading: boolean;
  currentPage: number; // 当前页码
  pageSize: number;   // 每页显示的页数
}


export default defineComponent({
  name: 'good',
  components: {SvgIcon, Add},
  setup() {
    const addRef = ref()
    const tableRef = ref()
    const searchKey = ref('')   // 搜索关键字

    const state = reactive<TableState>({
      data: [],
      total: 0,
      loading: false,
      currentPage: 1,
      pageSize: 10,
    });
    const currentData = computed(() => {
      return state.data.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
    })
    // 初始化表格数据
    const initTableData = () => {
      initCouponTable().then((res: any) => {
        resetData(res)
      })
    };
    // 更新表格数据
    const resetData = (res: any) => {
      state.data = res.data
      state.total = res.data.length
    }
    // 添加
    const onAdd = () => {
      addRef.value.openDialog()
    }

    // 搜索框
    const search = () => {
      state.loading = true
      searchInfo({
        keyword: searchKey.value
      }).then((res: any) => {
        state.loading = false // 加载动画结束
        if (res.code == 200) {
          resetData(res)
        } else {
          ElMessage.error('抱歉,搜索失败...')
        }
      })
    }

    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addRef,
      searchKey,
      currentData,
      search,
      initTableData,
      onAdd,
    };
  },
});
</script>

<style scoped lang="scss">

</style>