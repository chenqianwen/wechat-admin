<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Input v-model="searchModel.nickname" placeholder="请输入昵称搜搜..." style="width: 200px"/>
            <span @click="search"><Button type="primary" icon="search">搜索</Button></span>
            <Button @click="resetSearch" type="ghost">重置</Button>
        </Row>
        <Row class="margin-top-10 searchable-table-con1">
            <Table border :columns="columns" :data="tableData"></Table>
        </Row>
        <Row class="margin-top-10">
            <Page :total="total" @on-change="changePage" @on-page-size-change="changeSize" size="small" show-total show-elevator show-sizer/>
        </Row>
        <Modal v-model="showUpdateIntegral" title="修改积分" :loading="true"
               :mask-closable="false">
            <Form ref="integralForm" :model="integralForm" :label-width="80">
                <FormItem label="用户积分" prop="integral" :rules="{required: true, message: '积分不能为空', trigger: 'blur'}">
                    <Input v-model="integralForm.integral" placeholder="填写用户的积分"></Input>
                </FormItem>
            </Form>
            <Row slot="footer">
                <Button type="text" @click="showUpdateIntegral = false">取消</Button>
                <Button type="primary" @click="updateIntegral" :loading="updateIntegralLoading">确定</Button>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import WechatUserApi from '@/api/wehcat/wechatUserApi.js';

    var moment = require('moment');
    var wehcatUserApi = new WechatUserApi();

    export default {
        name: 'member_index',
        data() {
            return {
                searchModel:{
                    nickname: null
                },
                columns: [
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: '积分',
                        key: 'integral',
                        render: (h, params) => {
                            let integral = params.row.integral;
                            if (!integral) {
                                integral = '0';
                            }
                            return h('div', [
                                h('span', integral)
                            ]);
                        }
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        render: (h, params) => {
                            let sex = params.row.sex;
                            let text = '未知';
                            if (sex === 1) {
                                text = '男';
                            } else if (sex === 2) {
                                text = '女';
                            }
                            return h('div', [
                                h('span', text)
                            ]);
                        }
                    },
                    {
                        title: '省份',
                        key: 'province'
                    },
                    {
                        title: '订阅时间',
                        key: 'subscribeTime',
                        render: (h, params) => {
                            return h('div', [
                                h('span', moment(new Date(params.row.subscribe_time * 1000)).format('YYYY-MM-DD HH:mm'))
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateIntegralHandle(params.row);
                                        }
                                    }
                                }, '修改积分'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delete(params.row);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                tableData: [],
                total: 0,
                // 显示修改积分的窗口
                showUpdateIntegral: false,
                updateIntegralLoading: false,
                // 修改积分的表单
                integralForm: {
                    id: '',
                    userIntegralId: '',
                    integral: ''
                },
                pageModel: {
                    currentPage: 1,
                    pageSize: 10
                }
            }
        },
        methods: {
            search() {
                wehcatUserApi.list(this.pageModel, this.searchModel,(data) => {
                    this.tableData = data.list;
                    this.total = data.total;
                });
            },
            resetSearch() {
                this.searchModel.nickname = null;
            },
            changePage(val) {
                this.pageModel.currentPage = val
                this.search()
            },
            changeSize(val) {
                this.pageModel.pageSize = val
                this.search()
            },
            // 积分
            updateIntegralHandle(row) {
                this.showUpdateIntegral = true;
                // 用户ID
                this.integralForm.id = row.id;
                // 用户积分ID
                this.integralForm.userIntegralId = row.userIntegralId;
                this.integralForm.integral = row.integral;
            },
            updateIntegral() {
                this.$refs['integralForm'].validate((valid) => {
                    if (valid) {
                        this.updateIntegralLoading = true;
                        wehcatUserApi.updateIntegral(this.integralForm, (sData) => {
                            this.$Message.success('修改成功!');
                            this.updateIntegralLoading = false;
                            this.showUpdateIntegral = false;
                            this.search();
                        }, (eData) => {
                            this.$Message.error(eData.data);
                            this.updateIntegralLoading = false;
                        })
                    }
                })
            },
            // 删除
            delete(row) {
                let id = row.id
                if (id) {
                    wehcatUserApi.delete(id, (sData) => {
                        this.$Message.success('删除成功!');
                        this.search();
                    }, (eData) => {
                        this.$Message.error(eData.data);
                    })
                } else {
                    this.$Message.error('数据错误');
                }
            }
        },
        mounted() {
            this.search();
        },
        watch: {}
    };
</script>

