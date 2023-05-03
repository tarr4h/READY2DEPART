function BoardCategory({categoryList, register}){

    return (
        <div className="categoryWrapper">
            {categoryList.map((category, index) => (
                <div key={index} className="categoryRadio">
                    <input
                        type="radio"
                        name="category"
                        id={category.id}
                        value={category.id}
                        {...register('category')}
                        defaultChecked={index === 0}
                    />
                    <label htmlFor={category.id}>{category.nm}</label>
                </div>
            ))}
        </div>
    )
}

export default BoardCategory;