/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { IPaginateOption} from '../../types';

const paginate = (schema: any) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
   
  schema.statics.paginate = async function (filter: any, options: IPaginateOption) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit.toFixed(0), 10) > 0 ? parseInt(options.limit.toFixed(0), 10) : 10;
    const page = options.page && parseInt(options.page.toFixed(0), 10) > 0 ? parseInt(options.page.toFixed(0), 10) : 1;
    const skip = (page - 1) * limit;

    // Use Atlas Search if a query string is provided
    if (filter.query&& filter.query !== ''&&filter.query.length>2) {
      const aggregationPipeline = [
        {
          $search: {
            index: filter.searchIndex, // Replace with your Atlas Search index name
            text: {
              query: filter.query,
              path: {
                wildcard: '*', // Search all fields
              },
            },
          },
        },
        { $skip: skip },
        { $limit: limit },
        { $sort: { createdAt: -1 } },
      ];


      // Add populate stages
     
      const countPipeline = [
        {
          $search: {
            index: 'postsearch',
            text: {
              query: filter.query,
              path: {
                wildcard: '*', // Search all fields
              },
            },
          },
        },
        {
          $count: 'totalCount',
        },
      ];

      const aggregateResult = await this.aggregate(aggregationPipeline).exec();
      const results=await this.populate(aggregateResult, options.populate);
      const countResult = await this.aggregate(countPipeline).exec();
      const totalResults = countResult.length > 0 ? countResult[0].totalCount : 0; // Adjust this for `$search` if needed
      const totalPages = Math.ceil(totalResults / limit);

      return {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
    }

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.forEach((populateOption) => {
        docsPromise = docsPromise.populate(populateOption);
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

export default paginate;
