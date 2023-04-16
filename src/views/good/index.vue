<template>
  <div class="course-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15" style="position: relative">
        <el-button size="default" type="success" class="ml10" @click="onAdd" plain>
          <el-icon>
            <ele-Plus/>
          </el-icon>
          添加新点心
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onNew" plain>
          <el-icon>
            <ele-Plus/>
          </el-icon>
          添加新种类
        </el-button>
        <el-input v-model="searchKey" placeholder="搜索商品名" clearable class="w-50 m-2" size="default"
                  style="max-width: 300px;position: absolute;right: 30px">
          <template #append>
            <el-button @click="search">
              <SvgIcon name="ele-Search"></SvgIcon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-table :data="currentData" style="width: 100%"  ref="tableRef" v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
        <el-table-column label="种类listId" v-if="false" prop="listId"></el-table-column>
        <el-table-column prop="img" label="封面" align="center" width="100px">
          <template #default="scope" >
            <el-image :preview-src-list="[scope.row.img]" :src="scope.row.img"
                      fit="contain" preview-teleported style="width: 100%;min-height: 50px">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名" align="center" width="100px"></el-table-column>
        <el-table-column prop="intro" label="介绍"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="105px">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.state==='下架'">下架</el-tag>
            <el-tag type="success" v-else-if="scope.row.state==='上架'">上架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价"  align="center" ></el-table-column>
        <el-table-column prop="list" label="种类"  align="center" ></el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onEdit(scope.row)">
              修改
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
<!--    <AddTeacher ref="addTeacherRef" @tableChange='initTableData'></AddTeacher>-->
    <Edit ref="editRef" @tableChange='initTableData'></Edit>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import {ElMessage} from "element-plus";
import {IData} from "/@/views/good/interface";
// import AddTeacher from "/@/views/good/component/addTeacher.vue";
import Edit from "/@/views/good/component/edit.vue";
import {initGoodTable,searchInfo} from "/@/api/good/index.ts";


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
  components: { SvgIcon,Edit},
  setup() {
    const addTeacherRef = ref()
    const editRef = ref()
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
      initGoodTable().then((res:any) => {
        resetData(res)
      })
    };
    const onNew=()=>{

    }
    // 更新表格数据
    const resetData = (res: any) => {
      // const arr: Array<IData> = [];
      // res.data.forEach((val: any) => {
      //   arr.push({
      //     id: val.id,
      //     listId:val.listId,
      //     name:val.name,
      //     img: val.img,
      //     intro:val.intro,
      //     price:val.price,
      //     list: val.list,
      //     state:val.state,
      //   })
      // })
      // state.data = arr;
      // state.total = arr.length;
      state.data=res.data
      state.total=res.data.length
    }
    // 添加
    const onAdd = () => {
      addTeacherRef.value.openDialog()
    }

    // 搜索框
    const search= () => {
      state.loading=true
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
      editRef.value.openDialog(row)
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addTeacherRef,
      editRef,
      searchKey,
      currentData,
      search,
      initTableData,
      onAdd,
      onEdit,
      onNew
    };
  },
});
</script>

<style scoped lang="scss">

</style>