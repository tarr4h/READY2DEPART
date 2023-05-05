function BoardCategory({categoryList, register}){

    return (
        <div className="categoryWrapper">
            {categoryList.map((category, index) => (
                <div key={index} className="categoryRadio">
                    <input
                        type="radio"
                        name="category"
                        id={category.sysCd}
                        value={category.sysCd}
                        {...register('category')}
                        defaultChecked={index === 0}
                    />
                    <label htmlFor={category.sysCd}>{category.nm}</label>
                </div>
            ))}
        </div>
    )
}

export default BoardCategory;