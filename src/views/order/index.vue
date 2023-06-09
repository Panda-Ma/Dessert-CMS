<template>
  <div class="course-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15" style="position: relative">

        <el-button size="default" type="success" class="ml10" @click="getIncomplete" plain>
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询未完成订单
        </el-button>
        <el-input v-model="searchKey" placeholder="搜索订单编号" clearable class="w-50 m-2" size="default"
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
        <el-table-column label="订单编号" prop="id" width="100px" align="center"></el-table-column>
        <el-table-column label="用户userId" prop="userId" align="center"></el-table-column>
        <el-table-column prop="sum" label="总价" align="center" width="100px"></el-table-column>
        <el-table-column prop="num" label="商品数量" align="center"></el-table-column>
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="105px">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.state==='进行中'">进行中</el-tag>
            <el-tag type="success" v-else-if="scope.row.state==='已完成'">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onDetail(scope.row)">
              详情
            </el-button>
            <el-button size="small" text type="primary" @click="onEdit(scope.row)" v-if="scope.row.state=='进行中'">
              修改状态
            </el-button>
            <el-button size="small" text type="primary" @click="exportExcel(scope.row)">
              导出
            </el-button>
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
    <Detail ref="detailRef" @tableChange='initTableData'></Detail>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import {ElMessage} from "element-plus";
import {IData} from "/@/views/order/interface";
import Detail from "/@/views/order/component/detail.vue";
import {getDetail, initOrderTable, searchIncomplete, searchInfo, setOrderCompleted} from "/@/api/order/index.ts";
import {ElMessageBox} from "element-plus/es";
import {deleteCourse} from "/@/api/course";


// 页面数据：表格数据、分页数据
interface TableState {
  data: Array<IData>
  total: number;
  loading: boolean;
  currentPage: number; // 当前页码
  pageSize: number;   // 每页显示的页数
}


export default defineComponent({
  name: 'order',
  components: {SvgIcon, Detail},
  setup() {
    const detailRef = ref()
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
      initOrderTable().then((res: any) => {
        resetData(res)
      })
    };

    // 更新表格数据
    const resetData = (res: any) => {
      state.data = res.data
      state.total = res.data.length
    }

    const getIncomplete = () => {
      state.loading = true
      searchIncomplete().then((res: any) => {
        state.loading = false // 加载动画结束
        if (res.code == 200) {
          resetData(res)
        } else {
          ElMessage.error('抱歉,搜索失败...')
        }
      })
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
    const onEdit = (row: IData) => {
      ElMessageBox.confirm(`将订单编号-${row.id} 设为已完成（此操作不可撤销）`, '修改订单状态', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => { // 对应confirm
        setOrderCompleted({
          id: row.id
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('订单已完成');
            initTableData()
          } else ElMessage.error('修改订单状态失败')
        })
      })
    }
    const onDetail = (row: IData) => {
      detailRef.value.openDialog(row)
    }
    const exportExcel = async (row: IData) => {
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let str = '';
      let IOrder = {
        id: '订单编号', // 主键
        userId: '用户编号', // 用户id
        sum: '商品总价',
        num: '商品总数',
        note: '备注',
        time: '下单时间',
        state: '订单状态'
      }
      for (let item in row) {
        str = str + IOrder[item as keyof IData] + ',' + row[item as keyof IData] + '\n'
      }
      str = str + '\n商品明细\n'
      const res=await getDetail({
        orderId: row.id
      })
      for(let item of res.data.goods){
        str=str+item.name+','+`数量：${item.num}，实付价格：${item.price}\n`
      }

      //encodeURIComponent解决中文乱码
      let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = `订单明细-订单编号${row.id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      detailRef,
      searchKey,
      currentData,
      search,
      initTableData,
      onDetail,
      getIncomplete,
      onEdit,
      exportExcel
    };
  },
});
</script>

<style scoped lang="scss">

</style>