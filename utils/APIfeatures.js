class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A)Filtering
        let queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B)Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        queryObj = JSON.parse(queryStr);

        this.query = this.query.find(queryObj);

        return this;
    }

    sort() {
        //2)Sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            //sort('price ratingsAverage')
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        //3) Field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        //4)Pagination
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIfeatures;
