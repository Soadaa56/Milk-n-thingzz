class CraftsController < ApplicationController
  def index
    @crafts = Craft.all
  end

  def show
    @craft = Craft.find(params[:id])
    @craftimage = CraftImage.find(params[:id])
  end
end
