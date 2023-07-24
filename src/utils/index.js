import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({
    length: 6,
});

export function randomUniqueId() {
    return uid();
}

export const getDiffStr = (oldDate) => {
    if (typeof oldDate === "string") {
        oldDate = new Date(oldDate);
    }
    const diff = new Date().getTime() - oldDate.getTime();
    //to minutes
    const diffInMinutes = Math.floor(diff / 60000);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }
    //to hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }
    //to days
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} ngày trước`;
    }
    //to months
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} tháng trước`;
    }
    //to years
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
};

export function getDiffField(oldObj, newObj) {
    const diff = {};
    for (const key in newObj) {
        if (oldObj[key] !== newObj[key]) {
            diff[key] = newObj[key];
        }
    }
    return diff;
}
