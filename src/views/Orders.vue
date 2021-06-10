<template>
  <div class="orders">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-input
        placeholder="请输入内容"
        v-model="searchText"
        class="input-with-select"
        style="width: 400px; margin-left: 20px; margin-top: 20px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table
        :data="tableData"
        border
        style="width: 95%; margin-top: 20px; margin-left: 20px"
      >
        <el-table-column prop="did" label="#" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="150">
          <template slot-scope="porpe">
            <el-tag
              v-show="porpe.row.order_pay == 0"
              effect="dark"
              type="danger"
            >
              {{ porpe.row.order_pay == 0 ? "未付款" : null }}
            </el-tag>
            <el-tag effect="dark" v-show="porpe.row.order_pay == 1">
              {{ porpe.row.order_pay == 1 ? "已付款" : null }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120">
        </el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="220">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="xg(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              @click="wl(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
      <el-form :model="forms">
        <el-form-item label="活动区域" prop="region" style="margin-left: 50px">
          <el-select v-model="forms.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="详细地址"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input v-model="forms.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="物流进度" :visible.sync="dialogFormVisible1">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible1 = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "orders",
  data() {
    return {
      tableData: [],
      searchText: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      forms: {
        name: "",
        pass: "",
        email: "",
        phone: "",
      },
      formLabelWidth: "120px",
      activities: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      currentPage: 1,
    };
  },
  created() {
    this.show();
  },
  methods: {
    show() {
      this.$http
        .get("/orders", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          res.data.data.goods.map((item, index) => {
            item.update_time = this.$moment(item.update_time).format(
              "YYYY年MM月DD日 HH时mm分ss秒"
            );
            Object.assign(item, { did: index + 1 });
          });
          this.tableData = res.data.data.goods;
        });
    },
    xg() {
      this.dialogFormVisible = true;
    },
    wl(id) {
      this.dialogFormVisible1 = true;
      this.$http.get("/kuaidi/" + id).then((res) => {
        console.log(res);
        res.data.data.map((item, index) => {
          if (index == 0) {
            item.icon = "el-icon-location-outline";
            item.color = "#0bbd87";
            item.size = "large";
          } else {
            item.icon = "";
          }
        });
        this.activities = res.data.data;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.show();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.show();
    },
  },
};
</script>

<style>
.content {
  width: 100%;
  height: 100%;
  background: white;
  margin-top: 20px;
}
</style>