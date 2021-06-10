<template>
  <div class="add">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        style="margin-top: 20px; width: 95%; margin-left: 30px"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="Number(active)"
        align-center
        style="margin-top: 20px"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab切换 -->
      <el-tabs
        :tab-position="tabPosition"
        @tab-click="handleClick"
        style="margin-top: 20px"
      >
        <el-tab-pane label="基本信息">
          <el-form
            :label-position="labelPosition"
            label-width="80px"
            :model="formLabelAlign"
          >
            <el-form-item label="商品名称">
              <el-input v-model="formLabelAlign.goods_name" ></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="formLabelAlign.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="formLabelAlign.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="formLabelAlign.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="formLabelAlign.goods_cat"
                :options="options"
                :props="{
                  value: 'cat_id',
                  label: 'cat_name',
                  expandTrigger: 'hover',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <p
            v-for="item in dt"
            :key="item.id"
            style="font-size: 18px; margin-bottom: 45px"
          >
            {{ item.attr_name }}
          </p>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <div
            v-for="item in jt"
            :key="item.id"
            style="font-size: 18px; margin-bottom: 45px"
          >
            {{ item.attr_name }}
            <el-input v-model="item.attr_vals"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            ref="pictureUpload"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor v-model="nr" :options="editorOption"> </quill-editor>
          <el-button type="primary" @click="add" style="margin-top: 20px"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "add",
  data() {
    return {
      tabPosition: "left",
      labelPosition: "top",
      formLabelAlign: {
        goods_name: "",
        goods_cat: "",
        goods_price: "0",
        goods_number: "0",
        goods_weight: "0",
      },
      value: "",
      options: [],
      active: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      nr: "",
      editorOption: {},
      id: "",
      dt: [],
      jt: [],
    };
  },
  created() {
    this.$http.get("/categories").then((res) => {
      // console.log(res);
      this.options = res.data.data;
    });
  },
  methods: {
    handleRemove(file) {
      // ⭐ 获取到该组件调用handleRemove方法删除file对象
      this.$refs.pictureUpload.handleRemove(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      // console.log(file);
    },
    // 点击获取的id
    handleChange(value) {
      // console.log(value);
      this.id = value[2];
    },
    add() {
      this.$http
        .post("/goods", {
          goods_name: this.formLabelAlign.goods_name,
          goods_cat: this.formLabelAlign.goods_cat,
          goods_price: this.formLabelAlign.goods_price,
          goods_number: this.formLabelAlign.goods_number,
          goods_weight: this.formLabelAlign.goods_weight,
        })
        .then((res) => {
          console.log(res);
        });
    },
    // tab切换
    handleClick(tab) {
      // console.log(tab.index);
      this.active = tab.index;
      if (tab.index == 1) {
        let sel = "many";
        this.$http
          .get("/categories/" + this.id + "/attributes?sel=" + sel)
          .then((res) => {
            console.log(res);
            this.dt = res.data.data;
          });
      }
      if (tab.index == 2) {
        let sel = "only";
        this.$http
          .get("/categories/" + this.id + "/attributes?sel=" + sel)
          .then((res) => {
            console.log(res);
            this.jt = res.data.data;
          });
      }
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
  overflow: hidden;
}
.el-tabs__content {
  height: 100%;
  margin-bottom: 20px;
}
.ql-blank {
  height: 350px;
}
</style>