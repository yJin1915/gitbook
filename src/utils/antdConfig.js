import { message } from 'antd';
import moment from 'moment';
import { lastNDay } from '@/utils/utils';

export const pageSize = 30;

// antd表单FormItem 样式
export const formItemLayout0406 = { labelCol: { span: 4 }, wrapperCol: { span: 6 } };

export const tableImgStyle = { maxWidth: 120, maxHeight: 60 }; // table表预览图片
export const tableIconStyle = { width: 60, height: 60, borderRadius: 4 }; // table表预览icon

export const wholeDateFormat = 'YYYY-MM-DD';
export const wholeTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export const errorColor = { color: '#f5222d' }; // 错误提示颜色
export const statusColor = {
  success: '#52c41a',
  warning: '#faad14',
  info: '#40a9ff',
  error: '#f5222d',
}; // 状态色

export const textCenter = { textAlign: 'center' }; // 内容居中
export const textRight = { textAlign: 'right' }; // 内容居右
export const textLeft = { textAlign: 'left' }; // 内容居左

export const keepAllStyle = { wordBreak: 'keep-all', wordWrap: 'normal' }; // 防止文字换行断开

// 文本带换行符多行换行样式
export const preLineStyle = {
  textAlign: 'left',
  whiteSpace: 'pre-line',
  wordWrap: 'break-word',
  wordBreak: 'break-all',
};

export const breakWordStyle = {
  wordWrap: 'break-word',
  wordBreak: 'break-all',
};

// 正则验证8-20位包含字母和数字的密码
export const regPwd = new RegExp(
  /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
  'g'
);

// antd 表格单行文字过长断行样式
export const wordWrapStyle = { wordWrap: 'break-word', wordBreak: 'break-all' };

// 错误信息
export const errorInfo = (msg = '网络错误') => {
  message.error(msg);
};

// 正常信息
export const Info = msg => {
  message.info(msg);
};

// 成功信息
export const successInfo = msg => {
  message.success(msg);
};

// 验证身份证号
export const regIdcard = new RegExp(
  /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
  'g'
);

// 日期筛选公共底部区间筛选 今天/昨天/七天
export const rangePickerRanges = {
  今天: [moment().startOf('day'), moment().endOf('day')],
  昨天: [
    moment()
      .startOf('day')
      .subtract(1, 'day'),
    moment()
      .endOf('day')
      .subtract(1, 'day'),
  ],
  '7天': [lastNDay(6, true), lastNDay(0, true)],
};

// 分页page列表数
export const pageSizeOptions = ['30', '50', '100', '200', '300'];

// 日期筛选通用默认查询 不包含时间 isFormat: false 是否格式化
export const queryRangeDate = (preDays, isFormat = true) => {
  const startDate = moment(new Date()).subtract(preDays, 'days');
  const endDate = moment(new Date());
  return isFormat
    ? [startDate.format(wholeDateFormat), endDate.format(wholeDateFormat)]
    : [startDate, endDate];
};

/**
 * 限制时间筛选 精确到天
 * @param current-日期moment数据对象
 * @param limitDay --限制天数
 */
export const limitRangeDate = (current, limitDay, bannedFromDate) => {
  const numLimitDay = Number(limitDay) >= 1 ? Number(limitDay) - 1 : Number(limitDay); // 包含当天需减1
  return (
    current.diff(bannedFromDate, 'days', true) > numLimitDay ||
    current.diff(bannedFromDate, 'days', true) < -numLimitDay * 1
  );
};

// 昨天,精确到天 moment数组对象
export const momentYesterday = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];

// 通用模态框主体样式
export const commonModalBodyStyle = {
  maxHeight: '70vh',
  overflowY: 'auto',
  minHeight: '200px',
  paddingTop: 0,
};
